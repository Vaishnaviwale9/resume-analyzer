import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/10">
        <AlertTriangle className="h-8 w-8 text-rose-500" />
      </div>
      <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400">
        {message || "An unexpected error occurred. Please try again."}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-8">
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
      )}
    </div>
  );
}
