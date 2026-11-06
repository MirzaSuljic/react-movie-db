import { createContext } from 'react';

import type { ListName, Movie } from '../types';

export interface ListsContextValue {
  watchlist: Movie[];
  watched: Movie[];
  listOf: (id: number) => ListName | null;
  add: (list: ListName, movie: Movie) => void;
  remove: (list: ListName, id: number) => void;
}

export const ListsContext = createContext<ListsContextValue | null>(null);
