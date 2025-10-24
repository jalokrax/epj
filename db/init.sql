-- === EPJ MINIMAL SCHEMA (tilpas til jeres ER-diagram) ===
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN','DOCTOR','NURSE')),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  cpr TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  next_of_kin TEXT,
  consent_flag BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS encounters (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  started_at TIMESTAMP NOT NULL DEFAULT now(),
  ended_at TIMESTAMP,
  created_by_user_id TEXT NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  encounter_id TEXT NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
  author_user_id TEXT NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  revised_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diagnoses (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  code TEXT,
  text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS medications (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  atc_code TEXT,
  name TEXT NOT NULL,
  dose TEXT,
  route TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMP NOT NULL DEFAULT now(),
  stopped_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  diff_json JSONB,
  ts TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patients_cpr ON patients(cpr);
CREATE INDEX IF NOT EXISTS idx_encounters_patient ON encounters(patient_id);
CREATE INDEX IF NOT EXISTS idx_notes_encounter ON notes(encounter_id);

-- Seed (kun til udvikling)
INSERT INTO users (id,email,name,password_hash,role) VALUES
  ('u-admin','admin@epj.local','Admin','PLAINTEXT_ONLY_FOR_DEV','ADMIN'),
  ('u-doc','laege@epj.local','Læge','PLAINTEXT_ONLY_FOR_DEV','DOCTOR'),
  ('u-nurse','syg@epj.local','Sygeplejerske','PLAINTEXT_ONLY_FOR_DEV','NURSE')
ON CONFLICT (email) DO NOTHING;

INSERT INTO patients (id,cpr,name,dob,consent_flag)
VALUES ('p-anna','123456-7890','Anna Jensen','1990-05-20',true)
ON CONFLICT (cpr) DO NOTHING;

INSERT INTO encounters (id,patient_id,created_by_user_id)
VALUES ('e-1','p-anna','u-doc')
ON CONFLICT DO NOTHING;

INSERT INTO notes (id,encounter_id,author_user_id,body,version)
VALUES ('n-1','e-1','u-doc','Startnotat for Anna Jensen',1)
ON CONFLICT DO NOTHING;
