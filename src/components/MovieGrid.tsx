import type { ReactNode } from 'react';

export function MovieGrid({ children, dimmed = false }: { children: ReactNode; dimmed?: boolean }) {
  return (
    <ul
      aria-busy={dimmed || undefined}
      className={`mt-8 grid grid-cols-2 gap-x-5 gap-y-10 transition-opacity sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${dimmed ? 'opacity-50' : ''}`}
    >
      {children}
    </ul>
  );
}
