# Project Structure

```
resume-analyzer/
├── README.md
├── LICENSE
├── .gitignore
├── docker-compose.yml
│
├── docs/
│   ├── INSTALLATION.md
│   ├── API_DOCUMENTATION.md
│   └── PROJECT_STRUCTURE.md
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── main.py                  # FastAPI app entrypoint, middleware, routers
│       │
│       ├── core/
│       │   ├── config.py            # Pydantic settings (env vars)
│       │   ├── security.py          # Password hashing, JWT creation/decoding
│       │   └── logging_config.py    # Structured logging setup
│       │
│       ├── db/
│       │   ├── base.py              # SQLAlchemy declarative base
│       │   └── session.py           # Engine + session factory + get_db dependency
│       │
│       ├── models/                  # SQLAlchemy ORM models
│       │   ├── user.py
│       │   ├── resume.py
│       │   └── analysis.py
│       │
│       ├── schemas/                 # Pydantic request/response schemas
│       │   ├── user.py
│       │   ├── auth.py
│       │   ├── resume.py
│       │   └── analysis.py
│       │
│       ├── api/
│       │   ├── deps.py              # get_current_user dependency
│       │   └── routes/
│       │       ├── auth.py          # /auth/*
│       │       ├── resume.py        # /resumes/*
│       │       ├── analysis.py      # /dashboard/*
│       │       └── users.py         # /users/*
│       │
│       ├── services/                # Business logic, framework-agnostic
│       │   ├── pdf_parser.py        # PDF text extraction
│       │   ├── ai_analyzer.py       # Core AI analysis pipeline
│       │   ├── skills_data.py       # Skills taxonomy & role expectations
│       │   └── report_generator.py  # PDF report rendering
│       │
│       └── utils/
│           └── exceptions.py        # Custom AppError hierarchy
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── .env.example
    └── src/
        ├── main.tsx                 # App bootstrap, providers
        ├── App.tsx                  # Route definitions
        ├── index.css                # Tailwind layers + design system classes
        ├── vite-env.d.ts
        │
        ├── types/
        │   └── index.ts             # Shared TypeScript interfaces
        │
        ├── context/
        │   ├── ThemeContext.tsx     # Dark/light mode
        │   └── AuthContext.tsx      # Auth state, login/register/logout
        │
        ├── api/
        │   └── client.ts            # Axios instance, interceptors
        │
        ├── components/
        │   ├── ui/                  # Reusable primitives
        │   │   ├── Logo.tsx
        │   │   ├── ThemeToggle.tsx
        │   │   ├── Loader.tsx
        │   │   ├── SkeletonCard.tsx
        │   │   ├── EmptyState.tsx
        │   │   ├── ScoreGauge.tsx
        │   │   ├── SkillBar.tsx
        │   │   ├── Badge.tsx
        │   │   └── UploadDropzone.tsx
        │   ├── layout/
        │   │   ├── Navbar.tsx
        │   │   ├── Footer.tsx
        │   │   ├── ProtectedRoute.tsx
        │   │   └── ErrorBoundary.tsx
        │   └── charts/
        │       ├── SkillFrequencyChart.tsx
        │       └── ScoreTrendChart.tsx
        │
        └── pages/
            ├── Landing.tsx           # Marketing/landing page
            ├── Login.tsx
            ├── Register.tsx
            ├── Dashboard.tsx         # Upload + history + charts
            ├── AnalysisDetail.tsx    # Full analysis breakdown
            ├── NotFound.tsx          # 404 page
            └── ErrorPage.tsx         # Generic error page (used by ErrorBoundary)
```

## Architectural notes

- **Backend** follows a clean layered architecture: `api/routes` (HTTP layer)
  → `services` (business logic) → `models`/`db` (persistence). Routes never
  touch the database directly beyond simple queries; all analysis logic lives
  in `services/ai_analyzer.py`, which is pure Python and easily unit-testable.
- **Error handling** is centralized: routes raise typed `AppError` subclasses
  (`utils/exceptions.py`), which `main.py` maps to consistent JSON responses.
- **Frontend** separates concerns into `context/` (global state), `api/`
  (data fetching), `components/` (presentational + layout), and `pages/`
  (route-level screens) — a structure that scales cleanly as features grow.
