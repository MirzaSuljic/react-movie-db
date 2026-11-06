import { TMDB_API_KEY, TMDB_API_URL, TMDB_IMAGE_URL } from '../config';
import type { Movie, MovieList } from '../types';

interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
}

interface TmdbPage {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbMovie[];
}

export interface MoviePage {
  page: number;
  totalPages: number;
  totalResults: number;
  movies: Movie[];
}

export function toMovie(raw: TmdbMovie): Movie {
  return {
    id: raw.id,
    title: raw.title,
    posterPath: raw.poster_path ?? null,
    releaseDate: raw.release_date || null,
    voteAverage: raw.vote_average ?? 0,
    voteCount: raw.vote_count ?? 0,
  };
}

async function getPage(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<MoviePage> {
  const query = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'en-US',
    include_adult: 'false',
    ...params,
  });
  const response = await fetch(`${TMDB_API_URL}${path}?${query}`, { signal });
  if (!response.ok) {
    throw new Error(`TMDB responded with ${response.status}`);
  }
  const data = (await response.json()) as TmdbPage;
  return {
    page: data.page,
    totalPages: Math.min(data.total_pages, Math.ceil(data.total_results / 20), 500),
    totalResults: data.total_results,
    movies: data.results.map(toMovie),
  };
}

export function fetchMovies(list: MovieList, query: string, page: number, signal?: AbortSignal): Promise<MoviePage> {
  if (page > 500) {
    return Promise.resolve({ page, totalPages: 500, totalResults: 0, movies: [] });
  }
  return query
    ? getPage('/search/movie', { query, page: String(page) }, signal)
    : getPage(`/movie/${list}`, { page: String(page) }, signal);
}

export function posterUrl(path: string | null, size = 'w342'): string | null {
  return path ? `${TMDB_IMAGE_URL}/${size}${path}` : null;
}

export function yearOf(movie: Movie): string | null {
  return movie.releaseDate ? movie.releaseDate.slice(0, 4) : null;
}
