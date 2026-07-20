"""
PDF report generation service.

Renders an Analysis result into a polished, downloadable PDF report
using reportlab, so users can save/share their AI resume analysis.
"""
import io

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, ListFlowable, ListItem,
)


def _bullet_list(items: list[str], style) -> ListFlowable:
    return ListFlowable(
        [ListItem(Paragraph(item, style), leftIndent=10) for item in items],
        bulletType="bullet",
        start="•",
    )


def generate_analysis_pdf(resume_filename: str, target_role: str | None, analysis: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        leftMargin=20 * mm, rightMargin=20 * mm, topMargin=18 * mm, bottomMargin=18 * mm,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "TitleCustom", parent=styles["Title"], textColor=colors.HexColor("#4F46E5"),
    )
    heading_style = ParagraphStyle(
        "HeadingCustom", parent=styles["Heading2"], textColor=colors.HexColor("#1F2937"),
        spaceBefore=14, spaceAfter=6,
    )
    body_style = ParagraphStyle("BodyCustom", parent=styles["BodyText"], leading=15)

    story = []
    story.append(Paragraph("AI Resume Analysis Report", title_style))
    story.append(Paragraph(f"Resume: {resume_filename}", body_style))
    if target_role:
        story.append(Paragraph(f"Target Role: {target_role}", body_style))
    story.append(Spacer(1, 12))

    score_table = Table(
        [
            ["Overall Score", "ATS Score", "Job Match Score"],
            [f"{analysis['overall_score']}/100", f"{analysis['ats_score']}/100", f"{analysis['job_match_score']}/100"],
        ],
        colWidths=[55 * mm] * 3,
    )
    score_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EEF2FF")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#4338CA")),
        ("FONTSIZE", (0, 0), (-1, -1), 11),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
    ]))
    story.append(score_table)
    story.append(Spacer(1, 16))

    story.append(Paragraph("Summary", heading_style))
    story.append(Paragraph(analysis.get("summary", ""), body_style))

    if analysis.get("extracted_skills"):
        story.append(Paragraph("Extracted Skills", heading_style))
        story.append(Paragraph(", ".join(analysis["extracted_skills"]), body_style))

    if analysis.get("missing_skills"):
        story.append(Paragraph("Missing Skills for Target Role", heading_style))
        story.append(_bullet_list(analysis["missing_skills"], body_style))

    if analysis.get("strengths"):
        story.append(Paragraph("Strengths", heading_style))
        story.append(_bullet_list(analysis["strengths"], body_style))

    if analysis.get("weaknesses"):
        story.append(Paragraph("Weaknesses", heading_style))
        story.append(_bullet_list(analysis["weaknesses"], body_style))

    if analysis.get("grammar_suggestions"):
        story.append(Paragraph("Grammar & Style Suggestions", heading_style))
        story.append(_bullet_list(analysis["grammar_suggestions"], body_style))

    if analysis.get("keyword_suggestions"):
        story.append(Paragraph("Keyword Optimization", heading_style))
        story.append(_bullet_list(analysis["keyword_suggestions"], body_style))

    if analysis.get("recommendations"):
        story.append(Paragraph("Improvement Recommendations", heading_style))
        story.append(_bullet_list(analysis["recommendations"], body_style))

    doc.build(story)
    return buffer.getvalue()
