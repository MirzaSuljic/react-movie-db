import type { ListName, Media } from '../types';
import { toMediaType } from './media-type';

export interface ListsState {
  watchlist: Media[];
  watched: Media[];
}

export type ListsAction =
  | { type: 'add'; list: ListName; media: Media }
  | { type: 'remove'; list: ListName; media: Media };

export const sameMedia = (a: Pick<Media, 'id' | 'type'>, b: Pick<Media, 'id' | 'type'>) =>
  a.id === b.id && a.type === b.type;

export function listsReducer(state: ListsState, action: ListsAction): ListsState {
  const without = (list: Media[]) => list.filter(m => !sameMedia(m, action.media));
  switch (action.type) {
    case 'add': {
      const other: ListName = action.list === 'watchlist' ? 'watched' : 'watchlist';
      return {
        ...state,
        [other]: without(state[other]),
        [action.list]: [action.media, ...without(state[action.list])],
      };
    }
    case 'remove':
      return { ...state, [action.list]: without(state[action.list]) };
  }
}

export function listOf(state: ListsState, media: Pick<Media, 'id' | 'type'>): ListName | null {
  if (state.watchlist.some(m => sameMedia(m, media))) {
    return 'watchlist';
  }
  if (state.watched.some(m => sameMedia(m, media))) {
    return 'watched';
  }
  return null;
}

function toStoredMedia(value: unknown): Media | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const v = value as Record<string, unknown>;
  const title = typeof v.title === 'string' ? v.title : typeof v.name === 'string' ? v.name : null;
  if (typeof v.id !== 'number' || !title) {
    return null;
  }
  const text = (...values: unknown[]) => (values.find(x => typeof x === 'string' && x) as string | undefined) ?? null;
  const num = (...values: unknown[]) => (values.find(x => typeof x === 'number') as number | undefined) ?? 0;
  return {
    id: v.id,
    type: toMediaType(v.type),
    title,
    posterPath: text(v.posterPath, v.poster_path),
    releaseDate: text(v.releaseDate, v.release_date, v.first_air_date),
    voteAverage: num(v.voteAverage, v.vote_average),
    voteCount: num(v.voteCount, v.vote_count),
  };
}

export function parseStoredList(raw: string | null): Media[] {
  if (!raw) {
    return [];
  }
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.map(toStoredMedia).filter((m): m is Media => m !== null) : [];
  } catch {
    return [];
  }
}
