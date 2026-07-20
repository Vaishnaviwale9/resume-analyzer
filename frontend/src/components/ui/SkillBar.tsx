interface SkillBarProps {
  label: string;
  value: number; // 0-100
  color?: string;
}

export default function SkillBar({ label, value, color = "from-brand-500 to-purple-500" }: SkillBarProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-slate-500 dark:text-slate-400">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.max(4, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
