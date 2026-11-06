import type { ListName, Movie } from '../types';

export interface ListsState {
  watchlist: Movie[];
  watched: Movie[];
}

export type ListsAction =
  | { type: 'add'; list: ListName; movie: Movie }
  | { type: 'remove'; list: ListName; id: number };

export function listsReducer(state: ListsState, action: ListsAction): ListsState {
  switch (action.type) {
    case 'add': {
      const other: ListName = action.list === 'watchlist' ? 'watched' : 'watchlist';
      return {
        ...state,
        [other]: state[other].filter(m => m.id !== action.movie.id),
        [action.list]: [action.movie, ...state[action.list].filter(m => m.id !== action.movie.id)],
      };
    }
    case 'remove':
      return { ...state, [action.list]: state[action.list].filter(m => m.id !== action.id) };
  }
}

export function listOf(state: ListsState, id: number): ListName | null {
  if (state.watchlist.some(m => m.id === id)) {
    return 'watchlist';
  }
  if (state.watched.some(m => m.id === id)) {
    return 'watched';
  }
  return null;
}

function toStoredMovie(value: unknown): Movie | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const v = value as Record<string, unknown>;
  if (typeof v.id !== 'number' || typeof v.title !== 'string') {
    return null;
  }
  const text = (a: unknown, b: unknown) => (typeof a === 'string' ? a : typeof b === 'string' ? b : null);
  const num = (a: unknown, b: unknown) => (typeof a === 'number' ? a : typeof b === 'number' ? b : 0);
  return {
    id: v.id,
    title: v.title,
    posterPath: text(v.posterPath, v.poster_path),
    releaseDate: text(v.releaseDate, v.release_date) || null,
    voteAverage: num(v.voteAverage, v.vote_average),
    voteCount: num(v.voteCount, v.vote_count),
  };
}

export function parseStoredList(raw: string | null): Movie[] {
  if (!raw) {
    return [];
  }
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.map(toStoredMovie).filter((m): m is Movie => m !== null) : [];
  } catch {
    return [];
  }
}
