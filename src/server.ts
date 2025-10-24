import "dotenv/config";
import express from "express";
import cors from "cors";
import { Pool } from "pg";
import { v4 as uuid } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

// DB-connection
const DB_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/epj";
const pool = new Pool({ connectionString: DB_URL });

// lille audit-helper
async function audit(opts: {
  userId?: string | null;
  action: "READ" | "CREATE" | "UPDATE";
  entityType: string;
  entityId: string;
  diff?: any;
}) {
  const { userId, action, entityType, entityId, diff } = opts;
  const id = "a-" + uuid();
  await pool.query(
    `INSERT INTO audit_log (id, user_id, action, entity_type, entity_id, diff_json)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [id, userId ?? null, action, entityType, entityId, diff ?? null]
  );
}

// Healthcheck
app.get("/health", async (_req, res) => {
  const r = await pool.query("SELECT now()");
  res.json({ ok: true, dbTime: r.rows[0].now });
});

/* =========================
   Patients (læse/oprette)
   ========================= */

// Søg/læs patienter (query = del af CPR eller navn)
app.get("/patients", async (req, res) => {
  try {
    const q = String(req.query.query || "").trim();
    let rows;
    if (q) {
      rows = (
        await pool.query(
          `SELECT id, cpr, name, dob, consent_flag
           FROM patients
           WHERE cpr ILIKE $1 OR name ILIKE $1
           ORDER BY name LIMIT 50`,
          [`%${q}%`]
        )
      ).rows;
    } else {
      rows = (
        await pool.query(
          `SELECT id, cpr, name, dob, consent_flag
           FROM patients
           ORDER BY created_at DESC
           LIMIT 50`
        )
      ).rows;
    }
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

// Opret patient
app.post("/patients", async (req, res) => {
  const { cpr, name, dob, contact_phone, contact_email, next_of_kin, consent_flag } = req.body || {};
  if (!cpr || !name || !dob) return res.status(400).json({ error: "cpr, name, dob kræves" });
  const id = "p-" + uuid();

  try {
    const r = await pool.query(
      `INSERT INTO patients (id, cpr, name, dob, contact_phone, contact_email, next_of_kin, consent_flag)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, cpr, name, dob, consent_flag`,
      [id, cpr, name, dob, contact_phone ?? null, contact_email ?? null, next_of_kin ?? null, !!consent_flag]
    );
    await audit({ action: "CREATE", entityType: "Patient", entityId: id, diff: { cpr, name, dob } });
    res.status(201).json(r.rows[0]);
  } catch (e: any) {
    if (String(e?.message).includes("unique")) {
      return res.status(409).json({ error: "CPR findes allerede" });
    }
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   Encounters (kontakter)
   ========================= */

// Opret encounter/kontakt for en patient
app.post("/patients/:id/encounters", async (req, res) => {
  const patientId = req.params.id;
  const { created_by_user_id } = req.body || {};
  if (!created_by_user_id) return res.status(400).json({ error: "created_by_user_id kræves" });

  const id = "e-" + uuid();
  try {
    await pool.query(
      `INSERT INTO encounters (id, patient_id, created_by_user_id) VALUES ($1,$2,$3)`,
      [id, patientId, created_by_user_id]
    );
    await audit({ userId: created_by_user_id, action: "CREATE", entityType: "Encounter", entityId: id });
    res.status(201).json({ id, patientId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   Notes (journalnotater)
   ========================= */

// Opret note for en encounter (version stiger automatisk)
app.post("/encounters/:id/notes", async (req, res) => {
  const encounterId = req.params.id;
  const { author_user_id, body } = req.body || {};
  if (!author_user_id || !body) return res.status(400).json({ error: "author_user_id og body kræves" });

  try {
    const v = await pool.query(`SELECT COALESCE(MAX(version),0)+1 AS v FROM notes WHERE encounter_id=$1`, [encounterId]);
    const version = Number(v.rows[0].v);
    const id = "n-" + uuid();

    await pool.query(
      `INSERT INTO notes (id, encounter_id, author_user_id, body, version)
       VALUES ($1,$2,$3,$4,$5)`,
      [id, encounterId, author_user_id, body, version]
    );
    await audit({ userId: author_user_id, action: "CREATE", entityType: "Note", entityId: id, diff: { version } });
    res.status(201).json({ id, encounterId, version });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

// Liste noter til en encounter
app.get("/encounters/:id/notes", async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT id, author_user_id, body, version, created_at
       FROM notes
       WHERE encounter_id=$1
       ORDER BY version`,
      [req.params.id]
    );
    res.json(r.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
