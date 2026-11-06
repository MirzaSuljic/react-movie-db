import { Link, useSearchParams } from 'react-router';

import { fetchReleases, imageUrl } from '../../core/tmdb/tmdb';
import { ErrorBox } from '../../shared/components/ErrorBox';
import { MediaActions } from '../../shared/components/MediaActions';
import { PosterCard } from '../../shared/components/PosterCard';
import { ChevronIcon } from '../../shared/components/icons';
import { tabStyle } from '../../shared/components/styles';
import { useFetch } from '../../shared/hooks/useFetch';
import type { Media, MediaType } from '../../shared/types';
import {
  WEEKDAYS,
  currentMonth,
  dayLabel,
  monthGrid,
  monthLabel,
  monthName,
  shiftMonth,
  toMonth,
} from '../../shared/utils/calendar';
import { detailPath, toMediaType } from '../../shared/utils/media-type';

const POSTERS_PER_DAY = 3;

const tabs = [
  { type: 'movie', label: 'Movies' },
  { type: 'tv', label: 'TV shows' },
] as const;

const copy = {
  movie: { one: 'film', many: 'films', released: 'movies released this month', title: 'Movie' },
  tv: { one: 'show', many: 'shows', released: 'new series premiering this month', title: 'Series' },
};

const navButton =
  'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-white/20 hover:ring-marquee focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marquee';

function groupByDate(results: Media[], month: string) {
  const groups = new Map<string, Media[]>();
  for (const media of results) {
    if (media.releaseDate?.startsWith(month)) {
      const day = groups.get(media.releaseDate) ?? [];
      day.push(media);
      groups.set(media.releaseDate, day);
    }
  }
  return groups;
}

function jumpTo(date: string) {
  const target = document.getElementById(`day-${date}`);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
  }
}

export function CalendarPage() {
  const [params, setParams] = useSearchParams();
  const month = toMonth(params.get('month') ?? undefined);
  const type = toMediaType(params.get('type'));
  const text = copy[type];

  const { data, loading, failed, retry } = useFetch(`${type}|${month}`, signal =>
    fetchReleases(type, month, signal),
  );

  const href = (next: { month?: string; type?: MediaType }) => {
    const search = new URLSearchParams(params);
    if (next.month !== undefined) {
      if (next.month === currentMonth()) {
        search.delete('month');
      } else {
        search.set('month', next.month);
      }
    }
    if (next.type !== undefined) {
      if (next.type === 'movie') {
        search.delete('type');
      } else {
        search.set('type', next.type);
      }
    }
    return `?${search.toString()}`;
  };

  const ready = !loading && data;
  const byDate = ready ? groupByDate(data.results, month) : new Map<string, Media[]>();
  const agenda = [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b));
  const label = monthLabel(month);
  const prev = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <title>{`${text.title} premieres, ${label} | Watchlist`}</title>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-5xl font-bold leading-none sm:text-6xl">{label}</h1>
          <p className="mt-3 min-h-6 text-dust">
            {ready &&
              (data.totalResults > data.results.length
                ? `The ${data.results.length} most popular of ${data.totalResults.toLocaleString('en-US')} ${text.released}`
                : `${data.totalResults.toLocaleString('en-US')} ${text.released}`)}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div
            role="tablist"
            aria-label="What to show"
            className="inline-flex self-start rounded-full bg-velvet-800 p-1 ring-1 ring-white/10"
          >
            {tabs.map(tab => (
              <button
                key={tab.type}
                type="button"
                role="tab"
                aria-selected={type === tab.type}
                onClick={() => type !== tab.type && setParams(new URLSearchParams(href({ type: tab.type })), { replace: true })}
                className={tabStyle}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <nav aria-label="Months" className="flex items-center gap-2">
            <Link to={href({ month: prev })} className={navButton}>
              <ChevronIcon direction="left" className="size-4" />
              {monthName(prev)}
            </Link>
            {month !== currentMonth() && (
              <Link
                to={href({ month: currentMonth() })}
                className="rounded-full px-4 py-2 text-sm font-semibold text-dust hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marquee"
              >
                This month
              </Link>
            )}
            <Link to={href({ month: next })} className={navButton}>
              {monthName(next)}
              <ChevronIcon direction="right" className="size-4" />
            </Link>
          </nav>
        </div>
      </div>

      {failed ? (
        <ErrorBox title={`Couldn't load the releases for ${label} from TMDB.`} onRetry={retry} />
      ) : (
        <>
          <div className="mt-10 hidden md:block" aria-busy={loading || undefined}>
            <div className="grid grid-cols-7 pb-2 text-sm font-semibold text-dust" aria-hidden="true">
              {WEEKDAYS.map(weekday => (
                <div key={weekday} className="px-2">
                  {weekday}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-white/10 ring-1 ring-white/10">
              {monthGrid(month).map(day => {
                const items = byDate.get(day.date) ?? [];
                const shown = items.length > POSTERS_PER_DAY ? POSTERS_PER_DAY - 1 : items.length;
                return (
                  <div
                    key={day.date}
                    className={`flex min-h-36 flex-col gap-2 p-2 ${day.inMonth ? 'bg-velvet-900' : 'bg-velvet-950'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        aria-current={day.isToday ? 'date' : undefined}
                        className={`flex size-8 items-center justify-center rounded-full font-display text-xl font-semibold ${
                          day.inMonth ? '' : 'text-dust opacity-50'
                        } ${day.isToday ? 'bg-marquee text-velvet-950' : ''}`}
                      >
                        {day.day}
                      </span>
                      {items.length > 0 && (
                        <button
                          type="button"
                          onClick={() => jumpTo(day.date)}
                          className="rounded-full px-2 py-0.5 text-xs font-semibold text-dust hover:text-marquee focus-visible:outline-2 focus-visible:outline-marquee"
                        >
                          {items.length} {items.length === 1 ? text.one : text.many}
                        </button>
                      )}
                    </div>

                    {loading && day.inMonth ? (
                      <div className="h-14 w-10 rounded bg-velvet-800 motion-safe:animate-pulse" />
                    ) : (
                      items.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {items.slice(0, shown).map(media => {
                            const thumb = imageUrl(media.posterPath, 'w92');
                            return (
                              <Link
                                key={media.id}
                                to={detailPath(media)}
                                state={{ from: `/calendar${href({})}` }}
                                aria-label={media.title}
                                title={media.title}
                                className="block w-10 overflow-hidden rounded ring-1 ring-white/10 hover:ring-2 hover:ring-marquee focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marquee"
                              >
                                {thumb ? (
                                  <img src={thumb} alt="" loading="lazy" className="aspect-[2/3] w-full object-cover" />
                                ) : (
                                  <span className="flex aspect-[2/3] items-center justify-center bg-velvet-800 font-display text-lg text-dust">
                                    {media.title.charAt(0)}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                          {items.length > shown && (
                            <button
                              type="button"
                              onClick={() => jumpTo(day.date)}
                              aria-label={`See all ${items.length} ${text.many} on ${day.day}`}
                              className="flex aspect-[2/3] w-10 items-center justify-center rounded bg-velvet-800 text-sm font-semibold text-dust ring-1 ring-white/10 hover:text-marquee focus-visible:outline-2 focus-visible:outline-marquee"
                            >
                              +{items.length - shown}
                            </button>
                          )}
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {ready &&
            (agenda.length ? (
              <div className="mt-16 space-y-14">
                {agenda.map(([date, items]) => (
                  <section key={date} id={`day-${date}`} className="scroll-mt-8" aria-labelledby={`day-heading-${date}`}>
                    <h2
                      id={`day-heading-${date}`}
                      tabIndex={-1}
                      className="border-b border-white/10 pb-3 font-display text-3xl font-bold focus:outline-none"
                    >
                      {dayLabel(date)}
                    </h2>
                    <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      {items.map(media => (
                        <li key={media.id}>
                          <PosterCard media={media} actions={<MediaActions media={media} />} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ) : (
              <div className="mt-12 max-w-md">
                <p className="text-lg font-semibold">No releases found for {label}.</p>
                <p className="mt-1 text-dust">TMDB may not have dates for this month yet. Try the next one.</p>
              </div>
            ))}
        </>
      )}
    </section>
  );
}
