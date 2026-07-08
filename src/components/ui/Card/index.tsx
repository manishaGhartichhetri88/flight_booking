interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children?: React.ReactNode;
  /**
   * Variant adds colorful gradient styling. Use 'default' for the original white card.
   */
  variant?: 'default' | 'teal' | 'purple' | 'sunset' | 'ocean';
}

const VARIANT_STYLES: Record<string, string> = {
  default: 'bg-white border border-slate-200',
  teal: 'bg-gradient-to-r from-emerald-400 to-cyan-400',
  purple: 'bg-gradient-to-r from-violet-500 to-pink-500',
  sunset: 'bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500',
  ocean: 'bg-gradient-to-r from-sky-400 to-indigo-500',
};

export default function Card({ title, description, children, className = '', variant = 'default', ...props }: CardProps) {
  const outer = VARIANT_STYLES[variant] ?? VARIANT_STYLES.default;
  const isDefault = variant === 'default';

  return (
    <div className={`rounded-3xl p-[2px] ${outer} ${isDefault ? 'shadow-sm' : 'shadow-2xl'} ${className}`} {...props}>
      <div
        className={`rounded-3xl p-6 ${isDefault ? 'bg-white' : 'bg-white/10 backdrop-blur-sm'} ${
          isDefault ? '' : 'text-white'
        }`}
      >
        <div className="mb-4">
          <h3 className={`text-xl font-semibold ${isDefault ? 'text-slate-900' : 'text-white'}`}>{title}</h3>
          {description ? (
            <p className={`${isDefault ? 'mt-2 text-sm text-slate-600' : 'mt-2 text-sm text-white/90'}`}>
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
