import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 dark:border-white/10 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {!user && (
            <>
              <a href="#features" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400">
                Features
              </a>
              <a href="#how-it-works" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400">
                How it works
              </a>
            </>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/dashboard" className="btn-secondary !px-4 !py-2 text-sm">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-primary !px-4 !py-2 text-sm">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
                Get Started Free
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200/70 dark:border-white/10 px-4 py-4 md:hidden animate-fade-in">
          <div className="flex flex-col gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/dashboard" className="btn-secondary justify-start">Dashboard</Link>
                <button onClick={handleLogout} className="btn-primary justify-start">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary justify-start">Log in</Link>
                <Link to="/register" className="btn-primary justify-start">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
