import type { ReactNode } from 'react';

const gridClass = 'mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';

export function MediaGrid({ children, dimmed = false }: { children: ReactNode; dimmed?: boolean }) {
  return (
    <ul aria-busy={dimmed || undefined} className={`${gridClass} transition-opacity ${dimmed ? 'opacity-50' : ''}`}>
      {children}
    </ul>
  );
}

export function GridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <ul className={gridClass} aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <div className="aspect-[2/3] rounded-lg bg-velvet-800 motion-safe:animate-pulse" />
          <div className="mt-3 h-4 w-3/4 rounded bg-velvet-800 motion-safe:animate-pulse" />
        </li>
      ))}
    </ul>
  );
}
