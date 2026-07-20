import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, TrendingUp, Award, Files, Trash2, Download, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import UploadDropzone from "@/components/ui/UploadDropzone";
import EmptyState from "@/components/ui/EmptyState";
import SkeletonCard from "@/components/ui/SkeletonCard";
import Badge from "@/components/ui/Badge";
import SkillFrequencyChart from "@/components/charts/SkillFrequencyChart";
import ScoreTrendChart from "@/components/charts/ScoreTrendChart";
import { apiClient, extractErrorMessage } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import type { Resume, DashboardStats } from "@/types";

function scoreVariant(score: number): "success" | "warning" | "danger" {
  if (score >= 75) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [resumesRes, statsRes] = await Promise.all([
        apiClient.get<Resume[]>("/resumes"),
        apiClient.get<DashboardStats>("/dashboard/stats"),
      ]);
      setResumes(resumesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAnalyze() {
    if (!pendingFile) {
      toast.error("Select a resume PDF first.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", pendingFile);
    if (targetRole.trim()) formData.append("target_job_title", targetRole.trim());

    try {
      const res = await apiClient.post<Resume>("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Analysis complete!");
      setPendingFile(null);
      setTargetRole("");
      await loadData();
      navigate(`/analysis/${res.data.id}`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiClient.delete(`/resumes/${id}`);
      toast.success("Resume deleted");
      loadData();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  }

  async function handleDownload(id: string, filename: string) {
    try {
      const res = await apiClient.get(`/resumes/${id}/report`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `analysis-${filename}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  }

  const trendData = resumes
    .filter((r) => r.analysis)
    .slice()
    .reverse()
    .map((r, i) => ({ label: `#${i + 1}`, score: r.analysis!.overall_score }));

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-transparent">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold sm:text-3xl">Welcome back{user ? `, ${user.full_name.split(" ")[0]}` : ""} 👋</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Here's how your resumes are performing.</p>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { icon: Files, label: "Resumes Analyzed", value: stats?.total_resumes ?? 0 },
            { icon: TrendingUp, label: "Average Score", value: `${stats?.average_score ?? 0}` },
            { icon: Award, label: "Best Score", value: `${stats?.best_score ?? 0}` },
            { icon: FileText, label: "Avg ATS Score", value: `${stats?.average_ats_score ?? 0}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/10 to-purple-500/10">
                <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              </div>
              <p className="mt-3 text-2xl font-bold">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upload column */}
          <div className="card p-6 lg:col-span-1">
            <h2 className="font-semibold">Analyze a new resume</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Upload a PDF and (optionally) a target role.</p>
            <div className="mt-4">
              <UploadDropzone onFileSelected={setPendingFile} disabled={uploading} />
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium">Target job title (optional)</label>
              <input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="input-field"
              />
            </div>
            <button onClick={handleAnalyze} disabled={uploading || !pendingFile} className="btn-primary mt-4 w-full py-3">
              {uploading ? "Analyzing..." : "Run AI Analysis"}
            </button>
          </div>

          {/* Charts column */}
          <div className="card p-6 lg:col-span-2">
            <h2 className="mb-4 font-semibold">Score trend</h2>
            <ScoreTrendChart data={trendData} />
            <h2 className="mb-4 mt-6 font-semibold">Top skills across your resumes</h2>
            <SkillFrequencyChart data={stats?.skill_frequency ?? {}} />
          </div>
        </div>

        {/* History */}
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Upload history</h2>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          ) : resumes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No resumes analyzed yet"
              description="Upload your first resume above to get an instant AI-powered breakdown."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <div key={resume.id} className="card group flex flex-col p-5 transition-transform hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">
                        <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="max-w-[140px] truncate text-sm font-medium">{resume.filename}</p>
                        <p className="text-xs text-slate-500">{new Date(resume.uploaded_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {resume.analysis && (
                      <Badge variant={scoreVariant(resume.analysis.overall_score)}>
                        {resume.analysis.overall_score}/100
                      </Badge>
                    )}
                  </div>

                  {resume.target_job_title && (
                    <p className="mt-3 text-xs text-slate-500">Target: {resume.target_job_title}</p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4">
                    <button
                      onClick={() => navigate(`/analysis/${resume.id}`)}
                      className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
                    >
                      View details <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownload(resume.id, resume.filename)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-brand-600"
                        title="Download report"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(resume.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
