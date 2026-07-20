"""
Static reference data used by the heuristic AI analysis engine:
a curated skills taxonomy grouped by domain, and per-role "expected
skill" sets used for missing-skill detection and job matching.

This keeps ai_analyzer.py focused on logic rather than data.
"""

SKILL_TAXONOMY: dict[str, list[str]] = {
    "programming_languages": [
        "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust",
        "ruby", "php", "swift", "kotlin", "scala", "r", "sql",
    ],
    "web_frontend": [
        "react", "vue", "angular", "next.js", "svelte", "html", "css", "tailwind",
        "redux", "webpack", "vite",
    ],
    "web_backend": [
        "node.js", "express", "django", "flask", "fastapi", "spring boot",
        "ruby on rails", "graphql", "rest api", "microservices",
    ],
    "data_ai": [
        "machine learning", "deep learning", "pytorch", "tensorflow", "scikit-learn",
        "pandas", "numpy", "nlp", "computer vision", "data analysis",
        "data visualization", "power bi", "tableau",
    ],
    "cloud_devops": [
        "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ci/cd",
        "jenkins", "github actions", "linux",
    ],
    "database": [
        "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "sqlite",
        "dynamodb", "oracle",
    ],
    "soft_skills": [
        "leadership", "communication", "teamwork", "problem solving",
        "project management", "agile", "scrum", "mentoring", "collaboration",
    ],
    "design": [
        "figma", "adobe xd", "ui/ux", "sketch", "prototyping", "wireframing",
    ],
}

ALL_KNOWN_SKILLS: set[str] = {skill for group in SKILL_TAXONOMY.values() for skill in group}

# Baseline expected skills per common job title, used for "missing skills"
# and job-match scoring when the user specifies a target role.
ROLE_EXPECTATIONS: dict[str, list[str]] = {
    "frontend developer": ["javascript", "typescript", "react", "css", "html", "redux", "rest api"],
    "backend developer": ["python", "sql", "rest api", "docker", "postgresql", "microservices"],
    "full stack developer": [
        "javascript", "react", "node.js", "sql", "rest api", "docker", "git",
    ],
    "data scientist": [
        "python", "machine learning", "pandas", "numpy", "sql", "data visualization",
        "scikit-learn",
    ],
    "data analyst": ["sql", "excel", "data visualization", "tableau", "power bi", "python"],
    "devops engineer": ["docker", "kubernetes", "aws", "ci/cd", "terraform", "linux"],
    "product manager": [
        "project management", "agile", "scrum", "communication", "leadership",
        "data analysis",
    ],
    "ui/ux designer": ["figma", "ui/ux", "prototyping", "wireframing", "adobe xd"],
    "machine learning engineer": [
        "python", "pytorch", "tensorflow", "machine learning", "deep learning",
        "docker", "aws",
    ],
}

ACTION_VERBS = {
    "achieved", "built", "created", "delivered", "designed", "developed",
    "drove", "engineered", "improved", "increased", "launched", "led",
    "managed", "optimized", "reduced", "resolved", "spearheaded", "streamlined",
}

WEAK_PHRASES = [
    "responsible for", "duties included", "worked on", "helped with",
    "was involved in", "tasked with",
]
