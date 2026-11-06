import type { MovieList } from '../types';

export const DEFAULT_MOVIE_LIST: MovieList = 'top_rated';

export const MOVIE_LISTS: { id: MovieList; label: string; heading: string }[] = [
  { id: 'popular', label: 'Popular', heading: 'Popular movies' },
  { id: 'now_playing', label: 'Now playing', heading: 'Now in cinemas' },
  { id: 'upcoming', label: 'Upcoming', heading: 'Coming to cinemas' },
  { id: 'top_rated', label: 'Top rated', heading: 'Top rated movies' },
];

export function toMovieList(value: string | null): MovieList {
  return MOVIE_LISTS.find(l => l.id === value)?.id ?? DEFAULT_MOVIE_LIST;
}

export function headingOf(list: MovieList): string {
  return MOVIE_LISTS.find(l => l.id === list)?.heading ?? '';
}
