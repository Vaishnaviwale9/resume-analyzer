import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface ScoreTrendChartProps {
  data: { label: string; score: number }[];
}

export default function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-500">Upload resumes to track your score over time.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-white/5" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
        <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#scoreGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
