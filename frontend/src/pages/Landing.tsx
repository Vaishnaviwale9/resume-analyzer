import { Link } from "react-router-dom";
import {
  ArrowRight, ScanSearch, Target, Sparkles, FileCheck2,
  BarChart3, ShieldCheck, Zap, CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const FEATURES = [
  { icon: ScanSearch, title: "ATS Compatibility Score", desc: "See exactly how well your resume will parse through real applicant tracking systems." },
  { icon: Target, title: "Job Match Scoring", desc: "Compare your resume against a target role and get a precise match percentage." },
  { icon: Sparkles, title: "Skill Gap Detection", desc: "Instantly discover which in-demand skills are missing from your resume." },
  { icon: FileCheck2, title: "Grammar & Style", desc: "Catch weak phrasing, passive voice, and missing metrics before recruiters do." },
  { icon: BarChart3, title: "Visual Dashboard", desc: "Track scores, skills, and progress across every resume version you upload." },
  { icon: ShieldCheck, title: "Actionable Recommendations", desc: "Get a prioritized checklist of exactly what to fix, in plain English." },
];

const STEPS = [
  { step: "01", title: "Upload your resume", desc: "Drag & drop your PDF — parsing takes just a few seconds." },
  { step: "02", title: "Add your target role", desc: "Tell us the job title you're aiming for (optional but recommended)." },
  { step: "03", title: "Get instant AI insights", desc: "Receive scores, skill gaps, and a full improvement report." },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid-pattern [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="absolute -top-32 left-1/2 -z-10 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-500/30 to-purple-500/20 blur-3xl" />

        <div className="mx-auto max-w-5xl px-4 pb-24 pt-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-1.5 text-sm font-medium animate-fade-in">
            <Zap className="h-3.5 w-3.5 text-brand-600" />
            AI-Powered Resume Intelligence
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl animate-fade-in [animation-delay:100ms]">
            Land your next role,{" "}
            <span className="gradient-text">faster</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300 animate-fade-in [animation-delay:200ms]">
            Upload your resume and get instant ATS scoring, skill-gap detection,
            grammar suggestions, and a personalized improvement plan — powered by AI.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in [animation-delay:300ms]">
            <Link to="/register" className="btn-primary px-7 py-3.5 text-base">
              Analyze My Resume Free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how-it-works" className="btn-secondary px-7 py-3.5 text-base">
              See How It Works
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-500 dark:text-slate-400 animate-fade-in [animation-delay:400ms]">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Results in seconds</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Privacy-first</span>
          </div>

          {/* Preview card */}
          <div className="card relative mx-auto mt-16 max-w-3xl p-6 text-left animate-scale-in [animation-delay:500ms] sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Overall Resume Score</p>
                <p className="text-4xl font-extrabold gradient-text">87<span className="text-lg text-slate-400">/100</span></p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-slate-500">ATS Score</p>
                  <p className="text-xl font-bold text-emerald-500">92</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Job Match</p>
                  <p className="text-xl font-bold text-brand-500">81</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["React", "TypeScript", "Node.js", "AWS", "Leadership"].map((s) => (
                <span key={s} className="rounded-full bg-brand-50 dark:bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to stand out</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            A complete AI toolkit that reviews your resume like a hiring manager and an ATS at the same time.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card group p-6 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 transition-transform group-hover:scale-110">
                <Icon className="h-5.5 w-5.5 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-slate-50/70 dark:bg-white/[0.02] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Three simple steps to a stronger resume.</p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <span className="text-5xl font-extrabold text-brand-100 dark:text-white/10">{step}</span>
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="card relative overflow-hidden p-10 text-center sm:p-16">
          <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-brand-500/30 to-purple-500/20 blur-3xl" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to upgrade your resume?</h2>
          <p className="mx-auto mt-4 max-w-md text-slate-600 dark:text-slate-300">
            Join job seekers using AI to get past ATS filters and into interviews.
          </p>
          <Link to="/register" className="btn-primary mt-8 inline-flex px-7 py-3.5 text-base">
            Get Started — It's Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
