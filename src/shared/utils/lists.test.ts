import { describe, expect, it } from 'vitest';

import type { Media } from '../types';
import { listOf, listsReducer, parseStoredList, type ListsState } from './lists';

const media = (id: number, type: Media['type'] = 'movie'): Media => ({
  id,
  type,
  title: `Title ${id}`,
  posterPath: null,
  releaseDate: '2014-11-05',
  voteAverage: 8,
  voteCount: 10,
});

const empty: ListsState = { watchlist: [], watched: [] };

describe('listsReducer', () => {
  it('adds to the top of a list without duplicates', () => {
    let state = listsReducer(empty, { type: 'add', list: 'watchlist', media: media(1) });
    state = listsReducer(state, { type: 'add', list: 'watchlist', media: media(2) });
    state = listsReducer(state, { type: 'add', list: 'watchlist', media: media(1) });
    expect(state.watchlist.map(m => m.id)).toEqual([1, 2]);
  });

  it('keeps a movie and a TV show with the same id apart', () => {
    let state = listsReducer(empty, { type: 'add', list: 'watchlist', media: media(7) });
    state = listsReducer(state, { type: 'add', list: 'watchlist', media: media(7, 'tv') });
    expect(state.watchlist.map(m => m.type)).toEqual(['tv', 'movie']);
    expect(listOf(state, { id: 7, type: 'tv' })).toBe('watchlist');
  });

  it('moves between lists and removes', () => {
    let state = listsReducer(empty, { type: 'add', list: 'watchlist', media: media(1) });
    state = listsReducer(state, { type: 'add', list: 'watched', media: media(1) });
    expect(state).toEqual({ watchlist: [], watched: [media(1)] });

    state = listsReducer(state, { type: 'remove', list: 'watched', media: media(1) });
    expect(listOf(state, media(1))).toBeNull();
  });
});

describe('parseStoredList', () => {
  it('reads lists saved by older versions of the app', () => {
    const v1 = JSON.stringify([
      { id: 278, title: 'The Shawshank Redemption', poster_path: '/p.jpg', release_date: '1994-09-23', vote_average: 8.7, vote_count: 28000 },
    ]);
    const v2 = JSON.stringify([
      { id: 278, title: 'The Shawshank Redemption', posterPath: '/p.jpg', releaseDate: '1994-09-23', voteAverage: 8.7, voteCount: 28000 },
    ]);
    const expected = [
      { id: 278, type: 'movie', title: 'The Shawshank Redemption', posterPath: '/p.jpg', releaseDate: '1994-09-23', voteAverage: 8.7, voteCount: 28000 },
    ];
    expect(parseStoredList(v1)).toEqual(expected);
    expect(parseStoredList(v2)).toEqual(expected);
  });

  it('ignores broken data', () => {
    expect(parseStoredList(null)).toEqual([]);
    expect(parseStoredList('not json')).toEqual([]);
    expect(parseStoredList('[{"title":"no id"}, 5]')).toEqual([]);
  });
});
