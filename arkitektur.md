# Arkitektur (overblik)

- Client (React SPA) ↔ REST API (Node/Express) ↔ PostgreSQL
- Auth: JWT (access), RBAC (ADMIN/DOCTOR/NURSE)
- Sporbarhed: audit-log + versionshistorik på noter (ingen "hard delete")  

_Todo_:
- Komponentdiagram + sekvensdiagram "Opret journalnotat"
- ER-diagram (User, Patient, Encounter, Note, Diagnosis, Medication, AuditLog)
