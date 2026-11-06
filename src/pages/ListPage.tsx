import { Link } from 'react-router';

import { MovieGrid } from '../components/MovieGrid';
import { PosterCard } from '../components/PosterCard';
import { EyeIcon, UndoIcon } from '../components/icons';
import { buttonStyles } from '../components/styles';
import { useLists } from '../hooks/useLists';
import type { ListName } from '../types';

const copy = {
  watchlist: {
    title: 'To watch',
    emptyTitle: 'Your watchlist is empty.',
    emptyText: 'Find a movie and add it here to remember to see it.',
  },
  watched: {
    title: 'Watched',
    emptyTitle: "You haven't marked any movies as watched.",
    emptyText: 'Movies you mark as watched show up here.',
  },
};

export function ListPage({ list }: { list: ListName }) {
  const lists = useLists();
  const movies = lists[list];
  const text = copy[list];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <title>{`${text.title} | Watchlist`}</title>
      <h1 className="font-display text-5xl font-bold leading-none sm:text-6xl">{text.title}</h1>
      <p className="mt-3 min-h-6 text-dust">
        {movies.length > 0 && `${movies.length} ${movies.length === 1 ? 'movie' : 'movies'}`}
      </p>

      {movies.length ? (
        <MovieGrid>
          {movies.map(movie => (
            <li key={movie.id}>
              <PosterCard
                movie={movie}
                actions={
                  <>
                    {list === 'watchlist' ? (
                      <button type="button" className={buttonStyles.small} onClick={() => lists.add('watched', movie)}>
                        <EyeIcon className="size-3.5" />
                        Mark watched<span className="sr-only">: {movie.title}</span>
                      </button>
                    ) : (
                      <button type="button" className={buttonStyles.small} onClick={() => lists.add('watchlist', movie)}>
                        <UndoIcon className="size-3.5" />
                        Watch again<span className="sr-only">: {movie.title}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      className={buttonStyles.smallMuted}
                      onClick={() => lists.remove(list, movie.id)}
                    >
                      Remove<span className="sr-only"> {movie.title}</span>
                    </button>
                  </>
                }
              />
            </li>
          ))}
        </MovieGrid>
      ) : (
        <div className="mt-12 max-w-md">
          <p className="text-lg font-semibold">{text.emptyTitle}</p>
          <p className="mt-1 text-dust">{text.emptyText}</p>
          <Link to="/" className={`${buttonStyles.primary} mt-5`}>
            Find movies
          </Link>
        </div>
      )}
    </section>
  );
}
