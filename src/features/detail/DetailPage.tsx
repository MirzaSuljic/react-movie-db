import { Link, useLocation, useParams } from 'react-router';

import { fetchDetails, imageUrl } from '../../core/tmdb/tmdb';
import { MediaActions } from '../../shared/components/MediaActions';
import { ArrowLeftIcon } from '../../shared/components/icons';
import { buttonStyles } from '../../shared/components/styles';
import { useFetch } from '../../shared/hooks/useFetch';
import type { MediaType } from '../../shared/types';
import { yearOf } from '../../shared/utils/format';

function backLink(type: MediaType, from: unknown) {
  if (typeof from === 'string' && from.startsWith('/')) {
    const path = from.split('?')[0];
    const label =
      path === '/calendar'
        ? 'Back to the calendar'
        : path === '/watchlist'
          ? 'Back to To watch'
          : path === '/watched'
            ? 'Back to Watched'
            : path === '/tv'
              ? 'Back to TV shows'
              : path === '/'
                ? 'Back to movies'
                : null;
    if (label) {
      return { to: from, label };
    }
  }
  return type === 'tv' ? { to: '/tv', label: 'Back to TV shows' } : { to: '/', label: 'Back to movies' };
}

export function DetailPage({ type }: { type: MediaType }) {
  const { id } = useParams();
  const location = useLocation();
  const mediaId = Number(id);
  const valid = Number.isInteger(mediaId) && mediaId > 0;
  const back = backLink(type, (location.state as { from?: unknown } | null)?.from);

  const { data, loading, failed } = useFetch(`${type}|${id}`, signal =>
    valid ? fetchDetails(type, mediaId, signal) : Promise.reject(new Error('Invalid id')),
  );

  if (failed || (!loading && !data)) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <title>Not found | Watchlist</title>
        <div className="max-w-md" role="alert">
          <h1 className="font-display text-4xl font-bold">This title couldn't be loaded.</h1>
          <p className="mt-2 text-dust">
            It may have been removed from TMDB, or your connection dropped. Go back and pick another one.
          </p>
          <Link to={back.to} className={`${buttonStyles.primary} mt-6`}>
            {back.label}
          </Link>
        </div>
      </section>
    );
  }

  if (!data || loading) {
    return (
      <div aria-busy="true">
        <div className="h-[42vh] min-h-64 bg-velvet-800 motion-safe:animate-pulse sm:h-[56vh]" />
        <span className="sr-only" role="status">
          Loading details
        </span>
      </div>
    );
  }

  const m = data;
  const backdrop = imageUrl(m.backdropPath, 'w1280');
  const poster = imageUrl(m.posterPath, 'w500');
  const year = yearOf(m.releaseDate);

  return (
    <article>
      <title>{`${m.title}${year ? ` (${year})` : ''} | Watchlist`}</title>
      <div className="relative h-[42vh] min-h-64 overflow-hidden sm:h-[56vh]">
        {backdrop && <img src={backdrop} alt="" className="size-full object-cover object-top opacity-55" />}
        <div className="absolute inset-0 bg-linear-to-t from-velvet-900 via-velvet-900/70 to-velvet-900/10" />
      </div>

      <div className="relative mx-auto -mt-44 max-w-7xl px-4 pb-20 sm:-mt-64 sm:px-6 lg:px-8">
        <Link
          to={back.to}
          className="inline-flex items-center gap-2 rounded text-sm font-semibold text-dust hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marquee"
        >
          <ArrowLeftIcon className="size-4" />
          {back.label}
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-12">
          <div className="w-40 sm:w-56 md:w-full">
            {poster ? (
              <img
                src={poster}
                alt={`Poster for ${m.title}`}
                className="aspect-[2/3] w-full rounded-lg object-cover shadow-2xl shadow-black/60 ring-1 ring-white/10"
              />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center rounded-lg bg-velvet-800 p-4 text-center text-dust ring-1 ring-white/10">
                No poster
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-widest text-marquee">
              {type === 'movie' ? 'Movie' : 'TV show'}
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold leading-[0.95] break-words sm:text-7xl">{m.title}</h1>
            {m.originalTitle && <p className="mt-2 text-dust">{m.originalTitle}</p>}

            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-dust">
              {year && <span>{year}</span>}
              {m.runtime && <span>{m.runtime}</span>}
              {m.genres.length > 0 && <span>{m.genres.join(', ')}</span>}
            </p>

            <div className="mt-8 flex items-end gap-4">
              {m.voteCount ? (
                <>
                  <p className="font-display text-8xl font-bold leading-[0.8] text-marquee sm:text-9xl">
                    <span className="sr-only">Rated </span>
                    {m.voteAverage.toFixed(1)}
                  </p>
                  <p className="pb-1 leading-tight text-dust">
                    out of 10
                    <br />
                    from {m.voteCount.toLocaleString('en-US')} votes
                  </p>
                </>
              ) : (
                <p className="text-dust">Not rated yet</p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <MediaActions media={m} size="large" />
            </div>

            {m.tagline && <p className="mt-10 font-display text-2xl font-medium italic text-paper/90">{m.tagline}</p>}
            {m.overview && <p className="mt-4 max-w-prose text-lg leading-relaxed text-paper/85">{m.overview}</p>}

            {m.facts.length > 0 && (
              <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
                {m.facts.map(fact => (
                  <div key={fact.label}>
                    <dt className="text-sm text-dust">{fact.label}</dt>
                    <dd className="mt-0.5 font-semibold">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {m.cast.length > 0 && (
              <section className="mt-14" aria-labelledby="cast-heading">
                <h2 id="cast-heading" className="font-display text-3xl font-bold">
                  Cast
                </h2>
                <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {m.cast.map(person => {
                    const photo = imageUrl(person.profilePath, 'w185');
                    return (
                      <li key={person.creditId} className="flex items-center gap-3">
                        {photo ? (
                          <img
                            src={photo}
                            alt=""
                            loading="lazy"
                            className="size-14 shrink-0 rounded-full object-cover ring-1 ring-white/10"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-velvet-800 font-display text-xl font-bold text-dust"
                          >
                            {person.name.charAt(0)}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{person.name}</p>
                          {person.character && <p className="truncate text-sm text-dust">{person.character}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
