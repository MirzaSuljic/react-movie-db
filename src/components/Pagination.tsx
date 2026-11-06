import { Link, useSearchParams } from 'react-router';

import { pageSlots } from '../utils/pagination';
import { ChevronIcon } from './icons';

const edge =
  'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-paper ring-1 ring-white/20 hover:ring-marquee';
const arrow = 'flex size-10 items-center justify-center rounded-full text-paper ring-1 ring-white/20 hover:ring-marquee';

function usePageHref() {
  const [params] = useSearchParams();
  return (page: number) => {
    const next = new URLSearchParams(params);
    if (page > 1) {
      next.set('page', String(page));
    } else {
      next.delete('page');
    }
    const search = next.toString();
    return search ? `?${search}` : '?';
  };
}

interface PaginationProps {
  page: number;
  total: number;
  compact?: boolean;
  label?: string;
}

export function Pagination({ page, total, compact = false, label = 'Pages' }: PaginationProps) {
  const href = usePageHref();

  if (total <= 1) {
    return null;
  }

  if (compact) {
    return (
      <nav aria-label={label} className="flex items-center gap-2">
        {page > 1 ? (
          <Link to={href(page - 1)} rel="prev" aria-label="Previous page" className={arrow}>
            <ChevronIcon direction="left" className="size-5" />
          </Link>
        ) : (
          <span aria-hidden="true" className={`${arrow} opacity-30`}>
            <ChevronIcon direction="left" className="size-5" />
          </span>
        )}
        <p className="min-w-28 text-center text-sm tabular-nums text-dust">
          Page {page} of {total}
        </p>
        {page < total ? (
          <Link to={href(page + 1)} rel="next" aria-label="Next page" className={arrow}>
            <ChevronIcon direction="right" className="size-5" />
          </Link>
        ) : (
          <span aria-hidden="true" className={`${arrow} opacity-30`}>
            <ChevronIcon direction="right" className="size-5" />
          </span>
        )}
      </nav>
    );
  }

  return (
    <nav aria-label={label} className="flex items-center justify-between gap-4 sm:justify-center">
      {page > 1 ? (
        <Link to={href(page - 1)} rel="prev" className={edge}>
          <ChevronIcon direction="left" className="size-4" />
          Previous
        </Link>
      ) : (
        <span aria-hidden="true" className={`${edge} invisible`}>
          Previous
        </span>
      )}

      <p className="text-sm text-dust sm:hidden">
        Page {page} of {total}
      </p>

      <ol className="hidden items-center gap-1 sm:flex">
        {pageSlots(page, total).map((slot, index) => (
          <li key={index}>
            {slot === 'gap' ? (
              <span className="flex size-10 items-center justify-center text-dust">…</span>
            ) : slot === page ? (
              <span
                aria-current="page"
                className="flex size-10 items-center justify-center rounded-full bg-marquee font-display text-xl font-bold text-velvet-950"
              >
                {slot}
              </span>
            ) : (
              <Link
                to={href(slot)}
                aria-label={`Page ${slot}`}
                className="flex size-10 items-center justify-center rounded-full font-display text-xl font-semibold text-dust hover:bg-velvet-800 hover:text-paper"
              >
                {slot}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {page < total ? (
        <Link to={href(page + 1)} rel="next" className={edge}>
          Next
          <ChevronIcon direction="right" className="size-4" />
        </Link>
      ) : (
        <span aria-hidden="true" className={`${edge} invisible`}>
          Next
        </span>
      )}
    </nav>
  );
}
