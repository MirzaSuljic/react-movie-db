import { createContext } from 'react';

import type { ListName, Media } from '../types';

export interface ListsContextValue {
  watchlist: Media[];
  watched: Media[];
  listOf: (media: Pick<Media, 'id' | 'type'>) => ListName | null;
  add: (list: ListName, media: Media) => void;
  remove: (list: ListName, media: Media) => void;
}

export const ListsContext = createContext<ListsContextValue | null>(null);
