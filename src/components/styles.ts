const pill =
  'inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marquee disabled:cursor-default';

export const buttonStyles = {
  primary: `${pill} bg-marquee px-5 py-2 text-sm text-velvet-950 hover:bg-paper`,
  secondary: `${pill} px-5 py-2 text-sm text-paper ring-1 ring-white/25 hover:ring-marquee`,
  small: `${pill} px-3 py-1.5 text-xs text-paper ring-1 ring-white/20 hover:ring-marquee`,
  smallMuted: `${pill} px-3 py-1.5 text-xs text-dust ring-1 ring-white/10 hover:text-paper hover:ring-white/30`,
  smallActive: `${pill} bg-marquee/10 px-3 py-1.5 text-xs text-marquee ring-1 ring-marquee`,
};
