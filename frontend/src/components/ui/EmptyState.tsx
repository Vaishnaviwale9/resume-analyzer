import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 py-16 px-6 text-center animate-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 dark:bg-white/5">
        <Icon className="h-7 w-7 text-brand-600 dark:text-brand-400" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      {action}
    </div>
  );
}
