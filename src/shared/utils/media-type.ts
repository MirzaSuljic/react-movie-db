import type { Media, MediaType } from '../types';

export function toMediaType(value: unknown): MediaType {
  return value === 'tv' ? 'tv' : 'movie';
}

export const TYPE_LABELS: Record<MediaType, { plural: string; lower: string; one: string; many: string }> = {
  movie: { plural: 'Movies', lower: 'movies', one: 'movie', many: 'movies' },
  tv: { plural: 'TV shows', lower: 'TV shows', one: 'show', many: 'shows' },
};

export function detailPath(media: Pick<Media, 'id' | 'type'>): string {
  return `/${media.type}/${media.id}`;
}
