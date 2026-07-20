"""
AI Resume Analyzer — FastAPI application entrypoint.

Wires up middleware, exception handlers, routers, and startup DB init.
"""
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging_config import configure_logging
from app.db.base import Base
from app.db.session import engine
from app.utils.exceptions import AppError

# Import models so SQLAlchemy metadata is registered before create_all()
from app.models import user, resume, analysis  # noqa: F401

from app.api.routes import auth, resume as resume_routes, analysis as analysis_routes, users

configure_logging()
logger = logging.getLogger("resume_analyzer.main")

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered resume analysis, ATS scoring, and job-match insights.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    logger.warning("AppError on %s: %s", request.url.path, exc.message)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception on %s", request.url.path)
    return JSONResponse(status_code=500, content={"detail": "An unexpected error occurred."})


@app.on_event("startup")
def on_startup():
    logger.info("Starting %s (env=%s)", settings.APP_NAME, settings.APP_ENV)
    Base.metadata.create_all(bind=engine)


@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}


app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(resume_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(analysis_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(users.router, prefix=settings.API_V1_PREFIX)
