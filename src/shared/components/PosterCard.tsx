import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';

import { imageUrl } from '../../core/tmdb/tmdb';
import type { Media } from '../types';
import { yearOf } from '../utils/format';
import { detailPath } from '../utils/media-type';

export function PosterCard({ media, actions, label }: { media: Media; actions?: ReactNode; label?: string }) {
  const location = useLocation();
  const poster = imageUrl(media.posterPath, 'w342');
  const year = yearOf(media.releaseDate);
  const from = `${location.pathname}${location.search}`;

  return (
    <article className="flex h-full flex-col">
      <Link
        to={detailPath(media)}
        state={{ from }}
        className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marquee"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-velvet-800 ring-1 ring-white/10 transition group-hover:ring-2 group-hover:ring-marquee">
          {poster ? (
            <img
              src={poster}
              alt=""
              loading="lazy"
              className="size-full object-cover transition duration-300 motion-safe:group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center p-4 text-center font-display text-2xl font-semibold text-dust">
              {media.title}
            </div>
          )}
          <span className="absolute bottom-0 left-0 rounded-tr-lg bg-velvet-950/85 px-2.5 pb-1 pt-1.5 font-display text-3xl font-bold leading-none text-marquee">
            <span className="sr-only">Rating </span>
            {media.voteCount ? media.voteAverage.toFixed(1) : <span className="text-dust">–</span>}
          </span>
        </div>
        <h2 className="mt-3 line-clamp-2 font-semibold leading-snug group-hover:text-marquee">{media.title}</h2>
      </Link>
      {(year || label) && (
        <p className="mt-0.5 text-sm text-dust">{[year, label].filter(Boolean).join(' · ')}</p>
      )}

      {actions && <div className="mt-auto flex flex-wrap gap-2 pt-3">{actions}</div>}
    </article>
  );
}
