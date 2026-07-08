"use client";

type Props = { title: string; value: string; color?: 'indigo' | 'emerald' | 'rose' };

export default function SummaryCard({ title, value, color = 'indigo' }: Props) {
  const colorMap: Record<string, string> = {
    indigo: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-400 to-emerald-500',
    rose: 'from-rose-400 to-rose-500'
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow">
      <div className={`p-4 bg-gradient-to-r ${colorMap[color]} text-white`}> 
        <div className="text-sm opacity-90">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="p-3 bg-white text-sm text-slate-600">Updated just now</div>
    </div>
  );
}
