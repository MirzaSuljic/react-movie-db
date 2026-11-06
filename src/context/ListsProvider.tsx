import { useEffect, useMemo, useReducer, type ReactNode } from 'react';

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
      listOf: id => listOf(state, id),
      add: (list, movie) => dispatch({ type: 'add', list, movie }),
      remove: (list, id) => dispatch({ type: 'remove', list, id }),
    }),
    [state],
  );

  return <ListsContext value={value}>{children}</ListsContext>;
}
