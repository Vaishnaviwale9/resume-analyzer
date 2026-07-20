"""
AI Resume Analysis engine.

Design note: this module implements a fully self-contained, deterministic
heuristic analysis engine (regex + keyword taxonomy + rule-based scoring)
so the product works out of the box with zero external API keys or cost.

If OPENAI_API_KEY is configured, `generate_llm_summary()` can optionally be
wired in to produce a richer natural-language summary — the rest of the
scoring pipeline (ATS score, skills, job match, etc.) is intentionally kept
rule-based so results are fast, explainable, and reproducible.
"""
import re
from collections import Counter

from app.services.skills_data import (
    ALL_KNOWN_SKILLS,
    ROLE_EXPECTATIONS,
    ACTION_VERBS,
    WEAK_PHRASES,
)

SECTION_HEADERS = [
    "experience", "work experience", "education", "skills", "projects",
    "summary", "objective", "certifications", "achievements", "contact",
]

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_RE = re.compile(r"(\+?\d[\d\s\-()]{8,}\d)")
BULLET_RE = re.compile(r"^[\s]*[•\-\*▪●]\s+", re.MULTILINE)


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower())


def extract_skills(text: str) -> list[str]:
    normalized = _normalize(text)
    found = sorted({skill for skill in ALL_KNOWN_SKILLS if skill in normalized})
    return found


def detect_missing_skills(found_skills: list[str], target_role: str | None) -> list[str]:
    if not target_role:
        return []
    role_key = target_role.strip().lower()
    expected = ROLE_EXPECTATIONS.get(role_key)
    if not expected:
        # Fuzzy match against known role titles
        for key in ROLE_EXPECTATIONS:
            if key in role_key or role_key in key:
                expected = ROLE_EXPECTATIONS[key]
                break
    if not expected:
        return []
    found_set = set(found_skills)
    return sorted(set(expected) - found_set)


def compute_job_match_score(found_skills: list[str], target_role: str | None) -> int:
    if not target_role:
        return 0
    role_key = target_role.strip().lower()
    expected = ROLE_EXPECTATIONS.get(role_key)
    if not expected:
        for key in ROLE_EXPECTATIONS:
            if key in role_key or role_key in key:
                expected = ROLE_EXPECTATIONS[key]
                break
    if not expected:
        return 50  # neutral score when the role isn't in our taxonomy
    matched = len(set(expected) & set(found_skills))
    return round((matched / len(expected)) * 100)


def compute_ats_score(text: str) -> tuple[int, dict]:
    """
    Approximate ATS (Applicant Tracking System) compatibility score based on
    common ATS-parsing pain points: contact info presence, section headers,
    bullet usage, length, and formatting red flags.
    """
    normalized = _normalize(text)
    breakdown = {}

    has_email = bool(EMAIL_RE.search(text))
    has_phone = bool(PHONE_RE.search(text))
    breakdown["contact_info"] = 100 if (has_email and has_phone) else (60 if (has_email or has_phone) else 0)

    headers_found = sum(1 for h in SECTION_HEADERS if h in normalized)
    breakdown["section_structure"] = min(100, round((headers_found / 5) * 100))

    bullet_count = len(BULLET_RE.findall(text))
    breakdown["bullet_usage"] = min(100, bullet_count * 8)

    word_count = len(text.split())
    if 300 <= word_count <= 900:
        length_score = 100
    elif word_count < 300:
        length_score = round((word_count / 300) * 100)
    else:
        length_score = max(40, 100 - round((word_count - 900) / 20))
    breakdown["length"] = length_score

    # Formatting red flags: tables/columns often break ATS parsers, detected
    # crudely via excessive multiple-space runs (common export artifact).
    weird_spacing_ratio = len(re.findall(r" {3,}", text)) / max(word_count, 1)
    breakdown["formatting"] = 100 if weird_spacing_ratio < 0.01 else max(30, 100 - round(weird_spacing_ratio * 1000))

    weights = {
        "contact_info": 0.20,
        "section_structure": 0.25,
        "bullet_usage": 0.20,
        "length": 0.20,
        "formatting": 0.15,
    }
    overall = round(sum(breakdown[k] * weights[k] for k in weights))
    return max(0, min(100, overall)), breakdown


def grammar_and_style_suggestions(text: str) -> list[str]:
    suggestions: list[str] = []
    normalized = _normalize(text)

    for phrase in WEAK_PHRASES:
        if phrase in normalized:
            suggestions.append(
                f'Replace passive phrasing like "{phrase}" with a strong action verb '
                f'(e.g. "Led", "Built", "Delivered") to sound more results-driven.'
            )

    action_verb_hits = sum(1 for verb in ACTION_VERBS if verb in normalized)
    if action_verb_hits < 3:
        suggestions.append(
            "Start more bullet points with strong action verbs (Achieved, Built, "
            "Led, Optimized) instead of describing tasks passively."
        )

    if not re.search(r"\d", text):
        suggestions.append(
            "Add quantifiable metrics (%, $, time saved, team size) to back up "
            "your achievements — numbers make impact concrete and credible."
        )

    sentences = re.split(r"[.!?]\s", text)
    long_sentences = [s for s in sentences if len(s.split()) > 35]
    if long_sentences:
        suggestions.append(
            f"{len(long_sentences)} sentence(s) are quite long — consider breaking "
            "them into concise bullet points for easier scanning."
        )

    if len(re.findall(r"\bI\b", text)) > 3:
        suggestions.append(
            'Avoid first-person pronouns like "I" — resume bullets read best in '
            "implied first person without the pronoun."
        )

    if not suggestions:
        suggestions.append("Grammar and phrasing look solid — no major issues detected.")

    return suggestions[:6]


def keyword_optimization_suggestions(found_skills: list[str], target_role: str | None) -> list[str]:
    suggestions: list[str] = []
    missing = detect_missing_skills(found_skills, target_role)
    if missing:
        suggestions.append(
            "Consider naturally weaving in these role-relevant keywords: "
            + ", ".join(missing[:8])
        )
    if len(found_skills) < 6:
        suggestions.append(
            "Your skills section looks thin — list more relevant technical and "
            "tool-specific keywords to improve keyword-matching in ATS scans."
        )
    word_counts = Counter(re.findall(r"\b[a-zA-Z]{4,}\b", found_skills and " ".join(found_skills) or ""))
    if not suggestions:
        suggestions.append("Keyword coverage for your target role looks strong.")
    return suggestions


def identify_strengths(text: str, found_skills: list[str], ats_score: int) -> list[str]:
    strengths = []
    normalized = _normalize(text)
    if len(found_skills) >= 8:
        strengths.append(f"Strong, diverse skill set with {len(found_skills)} relevant skills detected.")
    if re.search(r"\d", text):
        strengths.append("Uses quantifiable metrics to demonstrate measurable impact.")
    if ats_score >= 75:
        strengths.append("Well-structured formatting that should parse cleanly through most ATS systems.")
    action_hits = sum(1 for verb in ACTION_VERBS if verb in normalized)
    if action_hits >= 5:
        strengths.append("Consistently uses strong action verbs to describe accomplishments.")
    if "education" in normalized:
        strengths.append("Clear education section is present.")
    if not strengths:
        strengths.append("Resume covers the basic expected structure.")
    return strengths[:5]


def identify_weaknesses(text: str, found_skills: list[str], ats_score: int, word_count: int) -> list[str]:
    weaknesses = []
    if ats_score < 60:
        weaknesses.append("Formatting or structure may cause parsing issues in ATS software.")
    if len(found_skills) < 5:
        weaknesses.append("Limited technical/skill keywords detected — may under-perform in keyword screening.")
    if word_count < 250:
        weaknesses.append("Resume seems short — consider elaborating on achievements and responsibilities.")
    if word_count > 1000:
        weaknesses.append("Resume is quite long — aim to trim to 1-2 pages of focused, high-impact content.")
    if not re.search(r"\d", text):
        weaknesses.append("No quantifiable metrics found — achievements would be more persuasive with numbers.")
    if not weaknesses:
        weaknesses.append("No major weaknesses detected — a few polish suggestions below.")
    return weaknesses[:5]


def build_recommendations(strengths: list[str], weaknesses: list[str], missing_skills: list[str]) -> list[str]:
    recs = []
    if missing_skills:
        recs.append(f"Add or highlight experience with: {', '.join(missing_skills[:6])}.")
    recs.append("Quantify at least 3-5 bullet points with concrete numbers (%, $, time, scale).")
    recs.append("Tailor your summary/objective to explicitly mention your target job title.")
    recs.append("Keep formatting simple: standard fonts, no tables/columns, clear section headers.")
    recs.append("Proofread for consistent verb tense and remove filler phrases like 'responsible for'.")
    return recs[:6]


def generate_summary(text: str, found_skills: list[str], target_role: str | None) -> str:
    word_count = len(text.split())
    skill_preview = ", ".join(found_skills[:5]) if found_skills else "a general skill set"
    role_clause = f" for the role of {target_role}" if target_role else ""
    return (
        f"This resume spans roughly {word_count} words and highlights {skill_preview}. "
        f"It demonstrates {'strong' if len(found_skills) >= 8 else 'developing'} technical depth"
        f"{role_clause}. Overall it presents a "
        f"{'well-rounded' if word_count > 300 else 'concise'} profile suitable for further tailoring."
    )


def analyze_resume(text: str, target_role: str | None = None) -> dict:
    """Main entrypoint: runs the full analysis pipeline and returns a dict
    matching the Analysis ORM model's fields."""
    found_skills = extract_skills(text)
    missing_skills = detect_missing_skills(found_skills, target_role)
    ats_score, section_scores = compute_ats_score(text)
    job_match_score = compute_job_match_score(found_skills, target_role)
    grammar = grammar_and_style_suggestions(text)
    keywords = keyword_optimization_suggestions(found_skills, target_role)
    strengths = identify_strengths(text, found_skills, ats_score)
    weaknesses = identify_weaknesses(text, found_skills, ats_score, len(text.split()))
    recommendations = build_recommendations(strengths, weaknesses, missing_skills)
    summary = generate_summary(text, found_skills, target_role)

    # Overall score blends ATS compatibility, job match (if available), and
    # a density-based "content quality" proxy from strengths vs weaknesses.
    quality_component = round((len(strengths) / (len(strengths) + len(weaknesses))) * 100)
    components = [ats_score, quality_component]
    if target_role:
        components.append(job_match_score)
    overall_score = round(sum(components) / len(components))

    return {
        "overall_score": overall_score,
        "ats_score": ats_score,
        "job_match_score": job_match_score,
        "summary": summary,
        "extracted_skills": found_skills,
        "missing_skills": missing_skills,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "grammar_suggestions": grammar,
        "keyword_suggestions": keywords,
        "recommendations": recommendations,
        "section_scores": section_scores,
    }
