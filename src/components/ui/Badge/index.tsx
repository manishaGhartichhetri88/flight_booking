interface BadgeProps {
  children: React.ReactNode;
}

export default function Badge({ children }: BadgeProps) {
  return <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{children}</span>;
}
