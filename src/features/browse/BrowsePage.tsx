import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

import { fetchList } from '../../core/tmdb/tmdb';
import { ErrorBox } from '../../shared/components/ErrorBox';
import { GridSkeleton, MediaGrid } from '../../shared/components/MediaGrid';
import { MediaActions } from '../../shared/components/MediaActions';
import { Pagination } from '../../shared/components/Pagination';
import { PosterCard } from '../../shared/components/PosterCard';
import { SearchIcon } from '../../shared/components/icons';
import { buttonStyles, chipStyle } from '../../shared/components/styles';
import { useFetch } from '../../shared/hooks/useFetch';
import type { MediaListId, MediaType } from '../../shared/types';
import { DEFAULT_MEDIA_LIST, MEDIA_LISTS, toMediaList } from '../../shared/utils/media-lists';
import { TYPE_LABELS } from '../../shared/utils/media-type';
import { toPage } from '../../shared/utils/pagination';

const number = (n: number) => n.toLocaleString('en-US');

export function BrowsePage({ type }: { type: MediaType }) {
  const [params, setParams] = useSearchParams();
  const query = (params.get('q') ?? '').trim();
  const page = toPage(params.get('page'));
  const list = toMediaList(type, params.get('list'));
  const labels = TYPE_LABELS[type];

  const [text, setText] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    if (text.trim() !== query) {
      setText(query);
    }
  }
  const typing = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(typing.current), []);

  const { data, loading, failed, retry } = useFetch(`${type}|${list.id}|${query}|${page}`, signal =>
    fetchList(type, list.id, query, page, signal),
  );

  const update = (next: { q?: string; list?: MediaListId }, replace = false) => {
    const search = new URLSearchParams(params);
    if (next.list !== undefined) {
      if (next.list === DEFAULT_MEDIA_LIST) {
        search.delete('list');
      } else {
        search.set('list', next.list);
      }
      search.delete('q');
    }
    if (next.q !== undefined) {
      if (next.q) {
        search.set('q', next.q);
      } else {
        search.delete('q');
      }
    }
    search.delete('page');
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

  const clearSearch = () => {
    clearTimeout(typing.current);
    setText('');
    update({ q: '' }, true);
  };

  const selectList = (next: MediaListId) => {
    clearTimeout(typing.current);
    setText('');
    update({ list: next }, true);
  };

  const heading = query ? `Results for “${query}”` : list.heading;
  const ready = !loading && data;
  const from = data ? (data.page - 1) * 20 + 1 : 0;
  const firstPage = new URLSearchParams(params);
  firstPage.delete('page');

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <title>{`${heading} | Watchlist`}</title>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-5xl font-bold leading-none break-words sm:text-6xl">{heading}</h1>
          <p className="mt-3 min-h-6 text-dust">
            {ready &&
              data.results.length > 0 &&
              `Showing ${number(from)}–${number(from + data.results.length - 1)} of ${number(data.totalResults)}`}
          </p>
        </div>

        <label className="relative block">
          <span className="sr-only">Search for {labels.lower === 'movies' ? 'a movie' : 'a TV show'}</span>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-dust" />
          <input
            type="search"
            autoComplete="off"
            value={text}
            onChange={event => onType(event.target.value)}
            placeholder={type === 'movie' ? 'Search for a movie' : 'Search for a TV show'}
            className="w-full rounded-full bg-velvet-800 py-2.5 pl-11 pr-4 text-paper ring-1 ring-white/10 placeholder:text-dust/70 focus:outline-none focus:ring-2 focus:ring-marquee sm:w-80"
          />
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-b border-white/10 pb-4 md:min-h-14 md:flex-row md:items-center md:justify-between">
        <div
          role="group"
          aria-label={`${labels.plural} lists`}
          className="-mx-4 -my-1 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:px-1"
        >
          {MEDIA_LISTS[type].map(option => (
            <button
              key={option.id}
              type="button"
              aria-pressed={!query && list.id === option.id}
              onClick={() => selectList(option.id)}
              className={chipStyle}
            >
              {option.label}
            </button>
          ))}
        </div>
        {ready && data.results.length > 0 && (
          <Pagination page={data.page} total={data.totalPages} compact label="Pages, top" />
        )}
      </div>

      {failed ? (
        <ErrorBox title={`Couldn't load ${labels.lower} from TMDB.`} onRetry={retry} />
      ) : !data ? (
        <GridSkeleton />
      ) : ready && data.results.length === 0 && page > 1 ? (
        <div className="mt-12 max-w-md">
          <p className="text-lg font-semibold">
            There are no {labels.lower} on page {page}.
          </p>
          <p className="mt-1 text-dust">The list is shorter than that. Start again from the first page.</p>
          <Link to={`?${firstPage.toString()}`} className={`${buttonStyles.secondary} mt-5`}>
            Go to page 1
          </Link>
        </div>
      ) : ready && data.results.length === 0 ? (
        <div className="mt-12 max-w-md">
          <p className="text-lg font-semibold">No {labels.lower} match “{query}”.</p>
          <p className="mt-1 text-dust">Check the spelling or try a shorter title.</p>
          <button type="button" onClick={clearSearch} className={`${buttonStyles.secondary} mt-5`}>
            Clear search
          </button>
        </div>
      ) : (
        <>
          <MediaGrid dimmed={loading}>
            {data.results.map(media => (
              <li key={media.id}>
                <PosterCard media={media} actions={<MediaActions media={media} />} />
              </li>
            ))}
          </MediaGrid>
          <div className="mt-14">
            <Pagination page={data.page} total={data.totalPages} label="Pages, bottom" />
          </div>
        </>
      )}
    </section>
  );
}
