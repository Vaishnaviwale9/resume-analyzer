import { clsx } from "clsx";

export default function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const styles = {
    default: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    danger: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  };
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", styles[variant])}>
      {children}
    </span>
  );
}
