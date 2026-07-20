"""Custom application exceptions, mapped to HTTP responses in main.py."""


class AppError(Exception):
    """Base class for expected, user-facing application errors."""
    status_code = 400

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class ResumeParsingError(AppError):
    status_code = 422


class AuthenticationError(AppError):
    status_code = 401


class NotFoundError(AppError):
    status_code = 404


class DuplicateUserError(AppError):
    status_code = 409
