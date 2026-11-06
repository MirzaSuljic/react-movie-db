import { useContext } from 'react';

import { ListsContext } from '../context/lists-context';

export function useLists() {
  const lists = useContext(ListsContext);
  if (!lists) {
    throw new Error('useLists must be used inside <ListsProvider>.');
  }
  return lists;
}
