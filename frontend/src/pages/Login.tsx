import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute -top-32 left-1/2 -z-10 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-500/20 to-purple-500/10 blur-3xl" />
      <div className="w-full max-w-md animate-scale-in">
        <div className="mb-8 flex justify-center">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="card p-8">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Log in to view your resume analytics.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="input-field pl-10"
                />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
              {submitting ? "Logging in..." : (<>Log in <ArrowRight className="h-4 w-4" /></>)}
            </button>
          </form>

          <button
            type="button"
            onClick={() => toast("Configure GOOGLE_CLIENT_ID to enable Google Sign-in.")}
            className="btn-secondary mt-3 w-full py-3"
          >
            <LogIn className="h-4 w-4" /> Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-brand-600 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
