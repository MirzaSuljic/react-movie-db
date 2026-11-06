import { Link, useSearchParams } from 'react-router';

import { MediaGrid } from '../../shared/components/MediaGrid';
import { PosterCard } from '../../shared/components/PosterCard';
import { EyeIcon, UndoIcon } from '../../shared/components/icons';
import { buttonStyles, chipStyle } from '../../shared/components/styles';
import { useLists } from '../../shared/hooks/useLists';
import type { ListName, MediaType } from '../../shared/types';

const copy = {
  watchlist: {
    title: 'To watch',
    emptyTitle: 'Your watchlist is empty.',
    emptyText: 'Find a movie or a TV show and add it here to remember to see it.',
  },
  watched: {
    title: 'Watched',
    emptyTitle: "You haven't marked anything as watched.",
    emptyText: 'Movies and TV shows you mark as watched show up here.',
  },
};

const filters: { id: MediaType | null; label: string }[] = [
  { id: null, label: 'All' },
  { id: 'movie', label: 'Movies' },
  { id: 'tv', label: 'TV shows' },
];

const typeLabel = { movie: 'Movie', tv: 'TV show' };

function summary(movies: number, shows: number) {
  const parts: string[] = [];
  if (movies) {
    parts.push(`${movies} ${movies === 1 ? 'movie' : 'movies'}`);
  }
  if (shows) {
    parts.push(`${shows} ${shows === 1 ? 'TV show' : 'TV shows'}`);
  }
  return parts.join(' and ');
}

export function ListPage({ list }: { list: ListName }) {
  const lists = useLists();
  const [params, setParams] = useSearchParams();
  const filter = params.get('type') === 'movie' || params.get('type') === 'tv' ? (params.get('type') as MediaType) : null;
  const all = lists[list];
  const items = filter ? all.filter(m => m.type === filter) : all;
  const text = copy[list];
  const movies = all.filter(m => m.type === 'movie').length;

  const selectFilter = (next: MediaType | null) => {
    setParams(next ? { type: next } : {}, { replace: true });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <title>{`${text.title} | Watchlist`}</title>
      <h1 className="font-display text-5xl font-bold leading-none sm:text-6xl">{text.title}</h1>
      <p className="mt-3 min-h-6 text-dust">{summary(movies, all.length - movies)}</p>

      {all.length > 0 && (
        <div role="group" aria-label="Show" className="mt-8 flex gap-2 border-b border-white/10 pb-4">
          {filters.map(option => (
            <button
              key={option.label}
              type="button"
              aria-pressed={filter === option.id}
              onClick={() => selectFilter(option.id)}
              className={chipStyle}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {items.length ? (
        <MediaGrid>
          {items.map(media => (
            <li key={`${media.type}-${media.id}`}>
              <PosterCard
                media={media}
                label={typeLabel[media.type]}
                actions={
                  <>
                    {list === 'watchlist' ? (
                      <button type="button" className={buttonStyles.small} onClick={() => lists.add('watched', media)}>
                        <EyeIcon className="size-3.5" />
                        Mark watched<span className="sr-only">: {media.title}</span>
                      </button>
                    ) : (
                      <button type="button" className={buttonStyles.small} onClick={() => lists.add('watchlist', media)}>
                        <UndoIcon className="size-3.5" />
                        Watch again<span className="sr-only">: {media.title}</span>
                      </button>
                    )}
                    <button type="button" className={buttonStyles.smallMuted} onClick={() => lists.remove(list, media)}>
                      Remove<span className="sr-only"> {media.title}</span>
                    </button>
                  </>
                }
              />
            </li>
          ))}
        </MediaGrid>
      ) : all.length ? (
        <div className="mt-12 max-w-md">
          <p className="text-lg font-semibold">
            No {filter === 'tv' ? 'TV shows' : 'movies'} in this list yet.
          </p>
          <Link to={filter === 'tv' ? '/tv' : '/'} className={`${buttonStyles.primary} mt-5`}>
            {filter === 'tv' ? 'Find TV shows' : 'Find movies'}
          </Link>
        </div>
      ) : (
        <div className="mt-12 max-w-md">
          <p className="text-lg font-semibold">{text.emptyTitle}</p>
          <p className="mt-1 text-dust">{text.emptyText}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/" className={buttonStyles.primary}>
              Find movies
            </Link>
            <Link to="/tv" className={buttonStyles.secondary}>
              Find TV shows
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
