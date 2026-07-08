interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export default function Select(props: SelectProps) {
  return (
    <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400" {...props} />
  );
}
