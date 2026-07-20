# API Documentation

Base URL: `http://localhost:8000/api/v1`
Interactive Swagger UI: `http://localhost:8000/api/docs`
ReDoc: `http://localhost:8000/api/redoc`

All authenticated endpoints require an `Authorization: Bearer <token>` header.

---

## Authentication

### `POST /auth/register`
Create a new account and receive a JWT.

**Body**
```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "password": "at-least-8-characters"
}
```

**Response `201`**
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": { "id": "uuid", "full_name": "Jane Doe", "email": "jane@example.com", "is_active": true, "created_at": "..." }
}
```

### `POST /auth/login`
**Body**
```json
{ "email": "jane@example.com", "password": "at-least-8-characters" }
```
**Response `200`** — same shape as register.

### `POST /auth/google`
Verifies a Google ID token (from Google Identity Services on the frontend)
and logs in / auto-registers the user.

**Body**
```json
{ "id_token": "<google-id-token>" }
```

### `GET /auth/me`
Returns the currently authenticated user. Requires `Authorization` header.

---

## Resumes

### `POST /resumes/upload`
Uploads a resume PDF, parses it, and runs the full AI analysis pipeline.

**Form-data**
| Field | Type | Required |
|---|---|---|
| `file` | PDF file | ✅ |
| `target_job_title` | string | optional |

**Response `201`** — `ResumeWithAnalysis`
```json
{
  "id": "uuid",
  "filename": "resume.pdf",
  "target_job_title": "Frontend Developer",
  "uploaded_at": "2026-07-20T10:00:00Z",
  "analysis": {
    "id": "uuid",
    "overall_score": 82,
    "ats_score": 88,
    "job_match_score": 75,
    "summary": "...",
    "extracted_skills": ["react", "typescript", "css"],
    "missing_skills": ["redux"],
    "strengths": ["..."],
    "weaknesses": ["..."],
    "grammar_suggestions": ["..."],
    "keyword_suggestions": ["..."],
    "recommendations": ["..."],
    "section_scores": { "contact_info": 100, "section_structure": 80, "bullet_usage": 96, "length": 100, "formatting": 100 },
    "created_at": "2026-07-20T10:00:01Z"
  }
}
```

### `GET /resumes`
Lists all resumes (with analyses) belonging to the authenticated user, newest first.

### `GET /resumes/{resume_id}`
Returns a single resume with its analysis.

### `DELETE /resumes/{resume_id}`
Deletes a resume and its associated analysis. Returns `204 No Content`.

### `GET /resumes/{resume_id}/report`
Streams a downloadable PDF report of the analysis (`application/pdf`).

---

## Dashboard

### `GET /dashboard/stats`
Returns aggregate stats for the authenticated user's dashboard.

**Response `200`**
```json
{
  "total_resumes": 5,
  "average_score": 78,
  "average_ats_score": 81,
  "best_score": 92,
  "skill_frequency": { "react": 4, "typescript": 3, "sql": 2 }
}
```

---

## Users

### `GET /users/profile`
Returns the authenticated user's profile (identical to `/auth/me`).

---

## System

### `GET /health`
Unauthenticated health check for load balancers / uptime monitors.
```json
{ "status": "ok", "app": "AI Resume Analyzer" }
```

---

## Error Format

All handled errors return a consistent shape:
```json
{ "detail": "Human-readable error message." }
```

| Status | Meaning |
|---|---|
| `400` | Generic bad request |
| `401` | Missing/invalid/expired auth token |
| `404` | Resource not found or not owned by the user |
| `409` | Duplicate resource (e.g. email already registered) |
| `422` | Validation error / unparseable PDF |
| `500` | Unexpected server error |
