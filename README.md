# EPJ – MVP (Elektronisk Patientjournal)

Dette projekt er en prototype (MVP) af et elektronisk patientjournalsystem udviklet i TypeScript, React og PostgreSQL.

## Formål
Systemet gør det muligt at:
- Søge og oprette patienter  
- Oprette nye kontakter og notater  
- (Senere) håndtere diagnoser og medicin  
- Udveksle data via XML  

---

## Teknologier
| Område | Teknologi | Formål |
|--------|------------|--------|
| **Frontend** | React (Vite, TypeScript) | Brugergrænseflade |
| **Backend** | Node.js + Express (TypeScript) | REST API |
| **Database** | PostgreSQL | Datahåndtering |
| **Kommunikation** | JSON / XML | Dataudveksling |
| **Container** | Docker Compose | Databaseopsætning |
| **Versionstyring** | Git + GitHub | Samarbejde og versionering |

---

## Projektstruktur

epj/
├── api/ # Backend
│ ├── src/
│ ├── package.json
│ ├── tsconfig.json
│ └── .env.example
├── web/ # Frontend
│ ├── src/
│ ├── package.json
│ ├── vite.config.ts
│ └── .env.example
├── docker-compose.yml # Starter database i Docker
└── README.md
<img width="412" height="374" alt="image" src="https://github.com/user-attachments/assets/87770f1b-54b5-45af-985b-dbcbd94a0f72" />




---

## Installation og opsætning

### Programliste
- Node.js
  - Installer og skriv dernæst node -v, og npm -v i GitBash for at tjekke om det er installeret korrekt
- Docker Desktop (Installer og log ind med Github-log ind. Docker Desktop skal køre i baggrunden)
- Git (GitBash) - programmet man skriver kommandoer i
- Visual Studio Code (VS Code)
  

Åben GitBash

### 1. Klon projektet

- git clone https://github.com/jalokrax/epj.git
- cd epj
- docker compose up -d


### 2. Start backend (API)

- cd api
- npm install
- npm run dev

API kører nu på http://localhost:3000


### 3. Start frontend (web) (I en ny terminal)

- cd web
- npm install
- npm run dev

Frontend kører nu på http://localhost:5173



