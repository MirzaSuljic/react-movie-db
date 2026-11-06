import type { ReactNode } from 'react';

import { posterUrl, yearOf } from '../lib/tmdb';
import type { Movie } from '../types';

export function PosterCard({ movie, actions }: { movie: Movie; actions: ReactNode }) {
  const poster = posterUrl(movie.posterPath);
  const year = yearOf(movie);

  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-velvet-800 ring-1 ring-white/10">
        {poster ? (
          <img src={poster} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center p-4 text-center font-display text-2xl font-semibold text-dust">
            {movie.title}
          </div>
        )}
        <span className="absolute bottom-0 left-0 rounded-tr-lg bg-velvet-950/85 px-2.5 pb-1 pt-1.5 font-display text-3xl font-bold leading-none text-marquee">
          <span className="sr-only">Rating </span>
          {movie.voteCount ? movie.voteAverage.toFixed(1) : <span className="text-dust">–</span>}
        </span>
      </div>

      <h2 className="mt-3 line-clamp-2 font-semibold leading-snug">{movie.title}</h2>
      {year && <p className="mt-0.5 text-sm text-dust">{year}</p>}

      <div className="mt-auto flex flex-wrap gap-2 pt-3">{actions}</div>
    </article>
  );
}
