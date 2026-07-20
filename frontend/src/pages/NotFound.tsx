import { Link } from "react-router-dom";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <span className="text-[8rem] font-extrabold leading-none gradient-text sm:text-[10rem]">404</span>
        <Compass className="absolute -right-2 top-2 h-10 w-10 animate-float text-brand-400" />
      </div>
      <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="btn-primary mt-8">
        <Home className="h-4 w-4" /> Back to home
      </Link>
    </div>
  );
}
