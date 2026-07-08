interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition';
  const styles = variant === 'secondary'
    ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
    : 'bg-slate-900 text-white hover:bg-slate-700';

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
