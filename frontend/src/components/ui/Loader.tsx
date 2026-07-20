export default function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-brand-200 dark:border-white/10" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-600" />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">{label}</p>
    </div>
  );
}
