import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 dark:border-white/10 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <Logo />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} ResumeAI. Built for job seekers who want an edge.
        </p>
      </div>
    </footer>
  );
}
