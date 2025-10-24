# EPJ – MVP (Elektronisk Patientjournal)

Dette projekt er en prototype (MVP) af et elektronisk patientjournalsystem udviklet i TypeScript, React og PostgreSQL.

## 🚀 Formål
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



---

## Installation og opsætning

### 1. Klon projektet

git clone https://github.com/jalokrax/epj.git
cd epj


### 2. Start backend (API)

cd api
npm install
npm run dev

# API kører nu på http://localhost:3000


### 3. Start frontend (web)

cd web
npm install
npm run dev

# Frontend kører nu på http://localhost:5173



