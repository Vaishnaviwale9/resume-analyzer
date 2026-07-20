interface ScoreGaugeProps {
  score: number; // 0-100
  label: string;
  size?: number;
}

export default function ScoreGauge({ score, label, size = 160 }: ScoreGaugeProps) {
  const radius = size / 2 - 12;
  const circumference = Math.PI * radius; // half circle
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const color = clamped >= 75 ? "#22c55e" : clamped >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        <path
          d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
          fill="none"
          stroke="currentColor"
          className="text-slate-100 dark:text-white/10"
          strokeWidth={12}
          strokeLinecap="round"
        />
        <path
          d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
        <text
          x="50%"
          y={size / 2 - 6}
          textAnchor="middle"
          className="fill-slate-900 dark:fill-white"
          fontSize={size * 0.22}
          fontWeight={800}
        >
          {clamped}
        </text>
      </svg>
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}
