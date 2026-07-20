"""
PDF parsing service.

Extracts plain text from an uploaded resume PDF using pdfplumber, which
handles most real-world resume layouts (columns, tables, bullet points)
better than a naive text extractor.
"""
import io
import logging

import pdfplumber

from app.utils.exceptions import ResumeParsingError

logger = logging.getLogger("resume_analyzer.pdf_parser")


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract and lightly normalize text from a PDF's raw bytes."""
    try:
        text_chunks: list[str] = []
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                text_chunks.append(page_text)
        full_text = "\n".join(text_chunks).strip()

        if not full_text:
            raise ResumeParsingError(
                "No readable text found in the PDF. It may be a scanned image without OCR."
            )
        return full_text
    except ResumeParsingError:
        raise
    except Exception as exc:  # noqa: BLE001
        logger.exception("Failed to parse PDF")
        raise ResumeParsingError(f"Could not parse the PDF file: {exc}") from exc
