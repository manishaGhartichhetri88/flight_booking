export const CARD_VARIANTS = {
  default: 'teal',
  accent1: 'teal',
  accent2: 'purple',
  accent3: 'sunset',
  accent4: 'ocean',
} as const;

export type CardVariant = typeof CARD_VARIANTS[keyof typeof CARD_VARIANTS];

export const BRAND = {
  primary: 'from-emerald-400 to-cyan-400',
  secondary: 'from-violet-500 to-pink-500',
};
