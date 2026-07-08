"use client";

import React from 'react';

type Props = {
  title: string;
  value: string | number;
  color?: 'indigo' | 'emerald' | 'rose' | 'slate';
};

export default function DashboardCard({ title, value, color = 'indigo' }: Props) {
  const bg = color === 'indigo' ? 'from-indigo-500 to-indigo-600' : color === 'emerald' ? 'from-emerald-400 to-emerald-500' : color === 'rose' ? 'from-rose-400 to-rose-500' : 'from-slate-400 to-slate-500';

  return (
    <div className="rounded-2xl overflow-hidden shadow">
      <div className={`p-4 bg-gradient-to-r ${bg} text-white`}> 
        <div className="text-sm opacity-90">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="p-3 bg-white text-sm text-slate-600">Updated just now</div>
    </div>
  );
}
