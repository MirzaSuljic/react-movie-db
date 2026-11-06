import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';

import { useLists } from '../shared/hooks/useLists';

const navLink =
  'inline-flex items-center gap-2 rounded-full px-3 py-2 text-dust hover:text-paper aria-[current=page]:text-marquee';

function Count({ value }: { value: number }) {
  return (
    <span className="rounded-full bg-velvet-800 px-2 py-0.5 text-xs tabular-nums text-paper ring-1 ring-white/10">
      {value}
    </span>
  );
}

export function Layout() {
  const { watchlist, watched } = useLists();
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const page = params.get('page');
  const month = params.get('month');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, page, month]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded bg-marquee px-4 py-2 text-velvet-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="rounded font-display text-3xl font-bold leading-none tracking-wide text-marquee">
            Watchlist
          </Link>

          <nav aria-label="Main" className="-mx-3 flex flex-wrap items-center gap-1 text-sm font-semibold sm:mx-0">
            <NavLink to="/" end className={navLink}>
              Movies
            </NavLink>
            <NavLink to="/tv" end className={navLink}>
              TV shows
            </NavLink>
            <NavLink to="/calendar" className={navLink}>
              Calendar
            </NavLink>
            <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-white/15 sm:block" />
            <NavLink to="/watchlist" className={navLink}>
              To watch <Count value={watchlist.length} />
            </NavLink>
            <NavLink to="/watched" className={navLink}>
              Watched <Count value={watched.length} />
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-dust sm:px-6 lg:px-8">
          <p>
            Movie and TV data from{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener"
              className="font-semibold text-paper underline decoration-white/30 underline-offset-4 hover:decoration-marquee"
            >
              TMDB
            </a>
            . This product uses the TMDB API but is not endorsed or certified by TMDB. Your lists are saved in
            this browser.
          </p>
        </div>
      </footer>
    </div>
  );
}
