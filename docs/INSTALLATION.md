# Installation Guide

This guide covers two setup paths: **Docker (recommended)** and **manual local
setup** for development.

---

## 1. Prerequisites

| Tool | Version | Required for |
|---|---|---|
| Docker & Docker Compose | 24+ | Docker setup |
| Node.js | 20+ | Manual frontend setup |
| Python | 3.11+ | Manual backend setup |
| PostgreSQL | 16+ | Manual backend setup (skip if using Docker) |

---

## 2. Docker Setup (Recommended)

```bash
# 1. Clone the repository
git clone <your-fork-url> resume-analyzer
cd resume-analyzer

# 2. Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. (Optional) Edit backend/.env to set a strong SECRET_KEY
#    and, if desired, GOOGLE_CLIENT_ID / OPENAI_API_KEY

# 4. Build and start all services
docker compose up --build
```

This starts three containers:

| Service | URL | Description |
|---|---|---|
| `frontend` | http://localhost:5173 | React app served via Nginx |
| `backend` | http://localhost:8000 | FastAPI REST API |
| `db` | localhost:5432 | PostgreSQL database |

Stop everything with `docker compose down`. Add `-v` to also wipe the
database volume: `docker compose down -v`.

---

## 3. Manual Local Setup

### 3.1 Database

Create a local PostgreSQL database:

```sql
CREATE USER resume_user WITH PASSWORD 'resume_pass';
CREATE DATABASE resume_analyzer OWNER resume_user;
```

### 3.2 Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env -> set DATABASE_URL to your local Postgres instance, e.g.:
# DATABASE_URL=postgresql://resume_user:resume_pass@localhost:5432/resume_analyzer

uvicorn app.main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`, with interactive Swagger
docs at `http://localhost:8000/api/docs`. Tables are auto-created on startup.

### 3.3 Frontend

```bash
cd frontend
npm install

cp .env.example .env
# Ensure VITE_API_BASE_URL=http://localhost:8000/api/v1

npm run dev
```

The app will be live at `http://localhost:5173`.

---

## 4. Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `APP_NAME` | AI Resume Analyzer | Display name |
| `APP_ENV` | development | `development` \| `production` |
| `DEBUG` | true | Enables verbose logging |
| `SECRET_KEY` | *(change me)* | JWT signing secret |
| `ALGORITHM` | HS256 | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 1440 | Token lifetime |
| `DATABASE_URL` | postgresql://... | SQLAlchemy connection string |
| `CORS_ORIGINS` | http://localhost:5173 | Comma-separated allowed origins |
| `GOOGLE_CLIENT_ID` | *(empty)* | Enables Google Sign-In when set |
| `OPENAI_API_KEY` | *(empty)* | Optional, for future LLM-enhanced summaries |
| `MAX_UPLOAD_SIZE_MB` | 10 | Max resume PDF size |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | http://localhost:8000/api/v1 | Backend API base URL |
| `VITE_GOOGLE_CLIENT_ID` | *(empty)* | Google OAuth client ID |

---

## 5. Production Notes

- Set `APP_ENV=production`, `DEBUG=false`, and a strong random `SECRET_KEY`.
- Serve the frontend build (`npm run build` → `dist/`) behind Nginx or a CDN;
  the provided `frontend/Dockerfile` already does this.
- Put the backend behind a reverse proxy (Nginx/Traefik) with HTTPS termination.
- Use managed PostgreSQL (RDS, Cloud SQL, etc.) in production rather than the
  bundled `db` container.
- Restrict `CORS_ORIGINS` to your real domain(s).

---

## 6. Troubleshooting

| Issue | Fix |
|---|---|
| `psycopg2` fails to build | Ensure `libpq-dev`/`postgresql-devel` is installed (handled automatically in Docker) |
| 401 errors on every request | Check `SECRET_KEY` matches between restarts and token hasn't expired |
| CORS errors in browser | Confirm `CORS_ORIGINS` in backend `.env` includes your frontend URL |
| PDF upload fails with parsing error | The PDF may be a scanned image with no embedded text (OCR not included) |
