import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface SkillFrequencyChartProps {
  data: Record<string, number>;
}

export default function SkillFrequencyChart({ data }: SkillFrequencyChartProps) {
  const chartData = Object.entries(data).map(([skill, count]) => ({ skill, count }));

  if (chartData.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-500">Not enough data yet — analyze a resume to see skill trends.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-slate-100 dark:text-white/5" />
        <XAxis type="number" hide />
        <YAxis dataKey="skill" type="category" width={100} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(99,102,241,0.06)" }}
          contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
        />
        <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="#6366f1" maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
