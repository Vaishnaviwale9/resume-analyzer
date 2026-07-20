export default function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-white/10 bg-[length:400px_100%] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      <div className="h-3 w-full rounded bg-slate-100 dark:bg-white/5" />
      <div className="h-3 w-5/6 rounded bg-slate-100 dark:bg-white/5" />
      <div className="h-24 w-full rounded-xl bg-slate-100 dark:bg-white/5" />
    </div>
  );
}
