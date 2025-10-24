import { useEffect, useState } from "react";
import { api } from "./api";

type Patient = { id: string; cpr: string; name: string; dob: string; consent_flag: boolean };
type Note = { id: string; author_user_id: string; body: string; version: number; created_at: string };

export default function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ cpr: "", name: "", dob: "" });

  const [selected, setSelected] = useState<Patient | null>(null);
  const [encounterId, setEncounterId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  async function loadPatients(query?: string) {
    const url = query ? `/patients?query=${encodeURIComponent(query)}` : "/patients";
    const { data } = await api.get<Patient[]>(url);
    setPatients(data);
  }

  useEffect(() => { loadPatients(); }, []);

async function createPatient(e: React.FormEvent) {
  e.preventDefault();
  if (!form.cpr || !form.name || !form.dob) return;

  await api.post("/patients", { ...form, consent_flag: true });

  // ryd form og søgetekst
  setForm({ cpr: "", name: "", dob: "" });
  setQ("");

  // HENT HELE LISTEN (ikke søgning)
  await loadPatients();     // <- vigtigt: kald UDEN parameter
}


  async function createEncounter(p: Patient) {
    setSelected(p);
    // bruger demo-lægen u-doc som creator
    const { data } = await api.post(`/patients/${p.id}/encounters`, { created_by_user_id: "u-doc" });
    setEncounterId(data.id);
    setNotes([]);
  }

  async function addNote() {
    if (!encounterId || !newNote.trim()) return;
    await api.post(`/encounters/${encounterId}/notes`, { author_user_id: "u-doc", body: newNote.trim() });
    setNewNote("");
    const { data } = await api.get<Note[]>(`/encounters/${encounterId}/notes`);
    setNotes(data);
  }

  async function loadNotes(id: string) {
    setEncounterId(id);
    const { data } = await api.get<Note[]>(`/encounters/${id}/notes`);
    setNotes(data);
  }

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>EPJ – MVP</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Søg patienter</h2>
        <form onSubmit={(e) => { e.preventDefault(); loadPatients(q); }}>
          <input
            placeholder="Søg på navn eller CPR"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ padding: 8, width: 300, marginRight: 8 }}
          />
          <button type="submit">Søg</button>
          <button
            type="button"
            onClick={() => { setQ(""); loadPatients(); }}
            style={{ marginLeft: 8 }}
          >
            Vis alle
          </button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Opret patient</h2>
        <form onSubmit={createPatient} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
          <input placeholder="CPR (fx 010101-0001)" value={form.cpr} onChange={e => setForm({ ...form, cpr: e.target.value })} />
          <input placeholder="Navn" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Fødselsdato (YYYY-MM-DD)" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
          <button type="submit">Opret</button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Patienter</h2>
        <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead><tr><th>CPR</th><th>Navn</th><th>Født</th><th>Handling</th></tr></thead>
          <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.cpr}</td>
              <td>{p.name}</td>
              <td>{p.dob?.slice(0,10)}</td>
              <td>
                <button onClick={() => createEncounter(p)}>Ny kontakt</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </section>

      {selected && (
        <section style={{ marginTop: 24 }}>
          <h2>Kontakt for: {selected.name}</h2>
          {encounterId ? (
            <>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  placeholder="Skriv note…"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  style={{ padding: 8, flex: 1 }}
                />
                <button onClick={addNote}>Tilføj note</button>
                <button onClick={() => loadNotes(encounterId!)}>Opdater noter</button>
              </div>
              <ul>
                {notes.map(n => (
                  <li key={n.id}>v{n.version}: {n.body} <small>({n.created_at?.slice(0,19).replace("T"," ")})</small></li>
                ))}
              </ul>
            </>
          ) : (
            <p>Opretter kontakt…</p>
          )}
        </section>
      )}
    </div>
  );
}
