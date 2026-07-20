import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft, Download, CheckCircle2, XCircle, Sparkles,
  SpellCheck2, KeyRound, ListChecks, Target,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Loader from "@/components/ui/Loader";
import ScoreGauge from "@/components/ui/ScoreGauge";
import SkillBar from "@/components/ui/SkillBar";
import Badge from "@/components/ui/Badge";
import { apiClient, extractErrorMessage } from "@/api/client";
import type { Resume } from "@/types";

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function AnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<Resume>(`/resumes/${id}`)
      .then((res) => setResume(res.data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDownload() {
    if (!resume) return;
    try {
      const res = await apiClient.get(`/resumes/${resume.id}/report`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `analysis-${resume.filename}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  }

  if (loading) return (<div><Navbar /><Loader label="Loading analysis..." /></div>);

  if (error || !resume?.analysis) {
    return (
      <div>
        <Navbar />
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <XCircle className="mx-auto h-12 w-12 text-rose-500" />
          <h1 className="mt-4 text-xl font-semibold">Analysis not found</h1>
          <p className="mt-2 text-sm text-slate-500">{error || "This resume has no analysis yet."}</p>
          <Link to="/dashboard" className="btn-primary mt-6 inline-flex">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const a = resume.analysis;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-transparent">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <button onClick={() => navigate("/dashboard")} className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>

        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{resume.filename}</h1>
            {resume.target_job_title && (
              <p className="mt-1 text-slate-500 dark:text-slate-400">Target role: {resume.target_job_title}</p>
            )}
          </div>
          <button onClick={handleDownload} className="btn-primary">
            <Download className="h-4 w-4" /> Download PDF Report
          </button>
        </div>

        {/* Gauges */}
        <div className="card mb-8 grid grid-cols-1 gap-8 p-8 sm:grid-cols-3">
          <ScoreGauge score={a.overall_score} label="Overall Score" />
          <ScoreGauge score={a.ats_score} label="ATS Compatibility" />
          <ScoreGauge score={a.job_match_score} label="Job Match" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section icon={Sparkles} title="AI Summary">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{a.summary}</p>
          </Section>

          <Section icon={ListChecks} title="Section Scores">
            <div className="space-y-4">
              {Object.entries(a.section_scores).map(([key, value]) => (
                <SkillBar key={key} label={key.replace(/_/g, " ")} value={value as number} />
              ))}
            </div>
          </Section>

          <Section icon={CheckCircle2} title="Strengths">
            <ul className="space-y-2">
              {a.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {s}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={XCircle} title="Weaknesses">
            <ul className="space-y-2">
              {a.weaknesses.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" /> {s}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Target} title="Skills Detected">
            <div className="flex flex-wrap gap-2">
              {a.extracted_skills.length === 0 && <p className="text-sm text-slate-500">No known skills detected.</p>}
              {a.extracted_skills.map((s) => <Badge key={s}>{s}</Badge>)}
            </div>
            {a.missing_skills.length > 0 && (
              <>
                <p className="mb-2 mt-4 text-sm font-medium">Missing for target role</p>
                <div className="flex flex-wrap gap-2">
                  {a.missing_skills.map((s) => <Badge key={s} variant="warning">{s}</Badge>)}
                </div>
              </>
            )}
          </Section>

          <Section icon={SpellCheck2} title="Grammar & Style Suggestions">
            <ul className="space-y-2">
              {a.grammar_suggestions.map((s, i) => (
                <li key={i} className="text-sm text-slate-600 dark:text-slate-300">• {s}</li>
              ))}
            </ul>
          </Section>

          <Section icon={KeyRound} title="Keyword Optimization">
            <ul className="space-y-2">
              {a.keyword_suggestions.map((s, i) => (
                <li key={i} className="text-sm text-slate-600 dark:text-slate-300">• {s}</li>
              ))}
            </ul>
          </Section>

          <Section icon={Sparkles} title="Improvement Recommendations">
            <ul className="space-y-2">
              {a.recommendations.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10 text-xs font-bold text-brand-600">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </main>
    </div>
  );
}
