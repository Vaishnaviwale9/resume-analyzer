export interface User {
  id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Analysis {
  id: string;
  resume_id: string;
  overall_score: number;
  ats_score: number;
  job_match_score: number;
  summary: string;
  extracted_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  grammar_suggestions: string[];
  keyword_suggestions: string[];
  recommendations: string[];
  section_scores: Record<string, number>;
  created_at: string;
}

export interface Resume {
  id: string;
  filename: string;
  target_job_title: string | null;
  uploaded_at: string;
  analysis: Analysis | null;
}

export interface DashboardStats {
  total_resumes: number;
  average_score: number;
  average_ats_score: number;
  best_score: number;
  skill_frequency: Record<string, number>;
}
