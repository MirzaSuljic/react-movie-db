import { useEffect, useMemo, useReducer, type ReactNode } from 'react';

import type { Media } from '../types';
import { listOf, listsReducer, parseStoredList, type ListsState } from '../utils/lists';
import { ListsContext, type ListsContextValue } from './lists-context';

function read(key: string) {
  try {
    return parseStoredList(localStorage.getItem(key));
  } catch {
    return [];
  }
}

function load(): ListsState {
  return { watchlist: read('watchlist'), watched: read('watched') };
}

function pick({ id, type, title, posterPath, releaseDate, voteAverage, voteCount }: Media): Media {
  return { id, type, title, posterPath, releaseDate, voteAverage, voteCount };
}

export function ListsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(listsReducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
      localStorage.setItem('watched', JSON.stringify(state.watched));
    } catch {
      return;
    }
  }, [state]);

  const value = useMemo<ListsContextValue>(
    () => ({
      watchlist: state.watchlist,
      watched: state.watched,
      listOf: media => listOf(state, media),
      add: (list, media) => dispatch({ type: 'add', list, media: pick(media) }),
      remove: (list, media) => dispatch({ type: 'remove', list, media }),
    }),
    [state],
  );

  return <ListsContext value={value}>{children}</ListsContext>;
}
