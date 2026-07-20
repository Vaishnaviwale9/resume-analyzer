"""
Centralized logging configuration.

Applies a consistent, structured log format across the app and
silences overly-chatty third-party loggers.
"""
import logging
import sys

from app.core.config import settings


def configure_logging() -> None:
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.handlers = [handler]

    # Quiet down noisy libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("passlib").setLevel(logging.ERROR)


logger = logging.getLogger("resume_analyzer")
