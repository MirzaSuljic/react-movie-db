import { describe, expect, it } from 'vitest';

import type { Movie } from '../types';
import { listOf, listsReducer, parseStoredList, type ListsState } from './lists';

const movie = (id: number): Movie => ({
  id,
  title: `Movie ${id}`,
  posterPath: null,
  releaseDate: '2014-11-05',
  voteAverage: 8,
  voteCount: 10,
});

const empty: ListsState = { watchlist: [], watched: [] };

describe('listsReducer', () => {
  it('adds to the top of a list without duplicates', () => {
    let state = listsReducer(empty, { type: 'add', list: 'watchlist', movie: movie(1) });
    state = listsReducer(state, { type: 'add', list: 'watchlist', movie: movie(2) });
    state = listsReducer(state, { type: 'add', list: 'watchlist', movie: movie(1) });
    expect(state.watchlist.map(m => m.id)).toEqual([1, 2]);
  });

  it('moves a movie between lists', () => {
    let state = listsReducer(empty, { type: 'add', list: 'watchlist', movie: movie(1) });
    state = listsReducer(state, { type: 'add', list: 'watched', movie: movie(1) });
    expect(state).toEqual({ watchlist: [], watched: [movie(1)] });
    expect(listOf(state, 1)).toBe('watched');

    state = listsReducer(state, { type: 'add', list: 'watchlist', movie: movie(1) });
    expect(listOf(state, 1)).toBe('watchlist');
    expect(state.watched).toEqual([]);
  });

  it('removes a movie', () => {
    const state = listsReducer({ watchlist: [movie(1), movie(2)], watched: [] }, { type: 'remove', list: 'watchlist', id: 1 });
    expect(state.watchlist.map(m => m.id)).toEqual([2]);
    expect(listOf(state, 1)).toBeNull();
  });
});

describe('parseStoredList', () => {
  it('reads lists saved by the old version of the app', () => {
    const old = JSON.stringify([
      { id: 278, title: 'The Shawshank Redemption', poster_path: '/p.jpg', release_date: '1994-09-23', vote_average: 8.7, vote_count: 28000 },
    ]);
    expect(parseStoredList(old)).toEqual([
      { id: 278, title: 'The Shawshank Redemption', posterPath: '/p.jpg', releaseDate: '1994-09-23', voteAverage: 8.7, voteCount: 28000 },
    ]);
  });

  it('ignores broken data', () => {
    expect(parseStoredList(null)).toEqual([]);
    expect(parseStoredList('not json')).toEqual([]);
    expect(parseStoredList('[{"title":"no id"}, 5]')).toEqual([]);
  });
});
