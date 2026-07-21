# 🚀 AI Resume Analyzer

A production-ready, full-stack AI Resume Analyzer with a premium, modern UI —
inspired by Linear, Stripe, Notion, and Apple design language.

Upload a resume PDF and instantly get an ATS compatibility score, extracted
skills, missing-skill detection, grammar suggestions, keyword optimization
tips, a job-match score, strengths/weaknesses, and a downloadable AI report.

![Tech](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Tech](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tech](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)
![Tech](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![AI Resume Analyzer](Screenshot%202026-07-21%20165739.png)

---

## ✨ Features

### Frontend
- React 18 + TypeScript + Tailwind CSS
- Fully responsive, dark/light mode
- Drag & drop PDF upload
- Animated, glassmorphic dashboard UI
- Toast notifications, loading skeletons, empty states, error pages

### Backend
- Python FastAPI, clean layered architecture (routes → services → models)
- JWT authentication (email/password + optional Google Sign-In)
- PostgreSQL + SQLAlchemy ORM
- Centralized error handling & structured logging
- Environment-variable driven configuration

### AI Analysis Engine
- Resume PDF parsing (pdfplumber)
- AI-generated resume summary
- Skills extraction against a curated taxonomy
- Missing-skill detection vs. target job role
- ATS compatibility score (structure, formatting, contact info, length)
- Grammar & style suggestions
- Keyword optimization suggestions
- Job-match scoring
- Strengths / weaknesses identification
- Prioritized improvement recommendations
- Downloadable AI report as PDF (reportlab)

> The analysis engine ships as a **self-contained heuristic scoring system**
> (no external API key required), and is structured so a hosted LLM can be
> plugged in later for richer natural-language summaries.

### Dashboard
- Upload history with per-resume analysis cards
- Score trend chart & top-skills bar chart (Recharts)
- ATS gauge, overall score gauge, job-match gauge
- Section-level skill progress bars

---

## 🗂 Project Structure

See [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md) for the full breakdown.

```
resume-analyzer/
├── backend/          # FastAPI app
├── frontend/         # React + TS + Tailwind app
├── docs/             # Documentation
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

## ⚡ Quick Start (Docker — recommended)

```bash
git clone <your-fork-url> resume-analyzer
cd resume-analyzer
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up --build
```

- Frontend → http://localhost:5173
- Backend API → http://localhost:8000
- API docs (Swagger) → http://localhost:8000/api/docs

Full setup instructions (including running without Docker): see
[`docs/INSTALLATION.md`](docs/INSTALLATION.md).

---

## 📖 Documentation

| Doc | Description |
|---|---|
| [Installation Guide](docs/INSTALLATION.md) | Local & Docker setup, environment variables |
| [API Documentation](docs/API_DOCUMENTATION.md) | REST endpoint reference |
| [Project Structure](docs/PROJECT_STRUCTURE.md) | Folder-by-folder breakdown |

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, Recharts, Framer Motion, Lucide Icons |
| Backend | FastAPI, SQLAlchemy, Pydantic, python-jose, passlib |
| Database | PostgreSQL |
| PDF | pdfplumber (parsing), reportlab (report generation) |
| Auth | JWT, optional Google Sign-In |
| Infra | Docker, Docker Compose, Nginx |

---

## 🔐 Environment Variables

See `backend/.env.example` and `frontend/.env.example` for the full list.
Key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing secret — **change in production** |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |
| `GOOGLE_CLIENT_ID` | Optional, enables Google Sign-In |
| `VITE_API_BASE_URL` | Frontend → backend API base URL |

---

## 🧪 Running Tests / Linting

```bash
# Backend
cd backend && python -m py_compile $(find app -name "*.py")

# Frontend
cd frontend && npm run lint
```

---

## 📄 License

MIT — see [LICENSE](LICENSE).
