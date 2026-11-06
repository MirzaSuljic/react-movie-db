import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

import { MovieGrid } from '../components/MovieGrid';
import { PosterCard } from '../components/PosterCard';
import { Pagination } from '../components/Pagination';
import { CheckIcon, EyeIcon, PlusIcon, SearchIcon } from '../components/icons';
import { buttonStyles } from '../components/styles';
import { useLists } from '../hooks/useLists';
import { fetchMovies, type MoviePage } from '../lib/tmdb';
import type { Movie, MovieList } from '../types';
import { DEFAULT_MOVIE_LIST, MOVIE_LISTS, headingOf, toMovieList } from '../utils/movie-lists';
import { toPage } from '../utils/pagination';

type Result = { key: string; page: MoviePage } | { key: string; error: true };

export function AddPage() {
  const [params, setParams] = useSearchParams();
  const query = (params.get('q') ?? '').trim();
  const page = toPage(params.get('page'));
  const list = toMovieList(params.get('list'));

  const [text, setText] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    if (text.trim() !== query) {
      setText(query);
    }
  }
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const typing = useRef<ReturnType<typeof setTimeout>>(undefined);

  const key = `${list}|${query}|${page}|${attempt}`;

  useEffect(() => {
    const controller = new AbortController();
    fetchMovies(list, query, page, controller.signal)
      .then(data => setResult({ key, page: data }))
      .catch(() => {
        if (!controller.signal.aborted) {
          setResult({ key, error: true });
        }
      });
    return () => controller.abort();
  }, [key, list, query, page]);

  useEffect(() => () => clearTimeout(typing.current), []);

  const update = (next: { q?: string; list?: MovieList }, replace = false) => {
    const search = new URLSearchParams(params);
    if (next.list !== undefined) {
      if (next.list === DEFAULT_MOVIE_LIST) {
        search.delete('list');
      } else {
        search.set('list', next.list);
      }
      search.delete('q');
      search.delete('page');
    }
    if (next.q !== undefined) {
      if (next.q) {
        search.set('q', next.q);
      } else {
        search.delete('q');
      }
      search.delete('page');
    }
    setParams(search, { replace });
  };

  const onType = (value: string) => {
    setText(value);
    clearTimeout(typing.current);
    typing.current = setTimeout(() => {
      if (value.trim() !== query) {
        update({ q: value.trim() }, true);
      }
    }, 400);
  };

  const current = result && 'page' in result ? result.page : null;
  const isFresh = result?.key === key;
  const loading = !isFresh;
  const failed = isFresh && result && 'error' in result;
  const heading = query ? `Results for “${query}”` : headingOf(list);
  const from = current ? (current.page - 1) * 20 + 1 : 0;
  const firstPageParams = new URLSearchParams(params);
  firstPageParams.delete('page');
  const firstPageHref = `?${firstPageParams.toString()}`;

  const selectList = (next: MovieList) => {
    clearTimeout(typing.current);
    setText('');
    update({ list: next }, true);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <title>{`${heading} | Watchlist`}</title>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-5xl font-bold leading-none break-words sm:text-6xl">{heading}</h1>
          <p className="mt-3 min-h-6 text-dust">
            {isFresh &&
              current &&
              current.movies.length > 0 &&
              `Showing ${from.toLocaleString('en-US')}–${(from + current.movies.length - 1).toLocaleString('en-US')} of ${current.totalResults.toLocaleString('en-US')}`}
          </p>
        </div>

        <label className="relative block">
          <span className="sr-only">Search for a movie</span>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-dust" />
          <input
            type="search"
            autoComplete="off"
            value={text}
            onChange={event => onType(event.target.value)}
            placeholder="Search for a movie"
            className="w-full rounded-full bg-velvet-800 py-2.5 pl-11 pr-4 text-paper ring-1 ring-white/10 placeholder:text-dust/70 focus:outline-none focus:ring-2 focus:ring-marquee sm:w-80"
          />
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-b border-white/10 pb-4 md:min-h-14 md:flex-row md:items-center md:justify-between">
        <div
          role="group"
          aria-label="Movie lists"
          className="-mx-4 -my-1 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:px-1"
        >
          {MOVIE_LISTS.map(option => (
            <button
              key={option.id}
              type="button"
              aria-pressed={!query && list === option.id}
              onClick={() => selectList(option.id)}
              className="shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold text-dust ring-1 ring-white/15 transition-colors not-aria-pressed:hover:text-paper not-aria-pressed:hover:ring-white/40 aria-pressed:bg-marquee/10 aria-pressed:text-marquee aria-pressed:ring-marquee"
            >
              {option.label}
            </button>
          ))}
        </div>
        {isFresh && current && current.movies.length > 0 && (
          <Pagination page={current.page} total={current.totalPages} compact label="Pages, top" />
        )}
      </div>

      {failed ? (
        <div className="mt-12 max-w-md rounded-lg bg-velvet-800 p-6 ring-1 ring-white/10" role="alert">
          <p className="font-semibold">Couldn't load movies from TMDB.</p>
          <p className="mt-1 text-dust">Check your internet connection, then try again.</p>
          <button type="button" onClick={() => setAttempt(n => n + 1)} className={`${buttonStyles.primary} mt-5`}>
            Try again
          </button>
        </div>
      ) : !current ? (
        <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" aria-busy="true">
          {Array.from({ length: 10 }, (_, i) => (
            <li key={i}>
              <div className="aspect-[2/3] rounded-lg bg-velvet-800 motion-safe:animate-pulse" />
              <div className="mt-3 h-4 w-3/4 rounded bg-velvet-800 motion-safe:animate-pulse" />
            </li>
          ))}
        </ul>
      ) : current.movies.length === 0 && isFresh && page > 1 ? (
        <div className="mt-12 max-w-md">
          <p className="text-lg font-semibold">There are no movies on page {page}.</p>
          <p className="mt-1 text-dust">The list is shorter than that. Start again from the first page.</p>
          <Link to={firstPageHref} className={`${buttonStyles.secondary} mt-5`}>
            Go to page 1
          </Link>
        </div>
      ) : current.movies.length === 0 && isFresh ? (
        <div className="mt-12 max-w-md">
          <p className="text-lg font-semibold">No movies match “{query}”.</p>
          <p className="mt-1 text-dust">Check the spelling or try a shorter title.</p>
          <button
            type="button"
            onClick={() => {
              setText('');
              update({ q: '' }, true);
            }}
            className={`${buttonStyles.secondary} mt-5`}
          >
            Clear search
          </button>
        </div>
      ) : (
        <>
          <MovieGrid dimmed={loading}>
            {current.movies.map(movie => (
              <li key={movie.id}>
                <PosterCard movie={movie} actions={<AddActions movie={movie} />} />
              </li>
            ))}
          </MovieGrid>
          <div className="mt-14">
            <Pagination page={current.page} total={current.totalPages} label="Pages, bottom" />
          </div>
        </>
      )}
    </section>
  );
}

function AddActions({ movie }: { movie: Movie }) {
  const { listOf, add } = useLists();
  const where = listOf(movie.id);

  if (where === 'watched') {
    return (
      <span className={buttonStyles.smallActive}>
        <CheckIcon className="size-3.5" />
        Watched
      </span>
    );
  }

  return (
    <>
      {where === 'watchlist' ? (
        <Link to="/watchlist" className={buttonStyles.smallActive}>
          <CheckIcon className="size-3.5" />
          To watch
        </Link>
      ) : (
        <button type="button" className={buttonStyles.small} onClick={() => add('watchlist', movie)}>
          <PlusIcon className="size-3.5" />
          To watch<span className="sr-only">: {movie.title}</span>
        </button>
      )}
      <button type="button" className={buttonStyles.small} onClick={() => add('watched', movie)}>
        <EyeIcon className="size-3.5" />
        Watched<span className="sr-only">: {movie.title}</span>
      </button>
    </>
  );
}
