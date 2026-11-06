import type { TmdbCredits } from './tmdb-credits';
import type { TmdbGenre } from './tmdb-genre';

export interface TmdbDetailsBase {
  id: number;
  overview: string;
  tagline?: string;
  genres: TmdbGenre[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  status?: string;
  original_language?: string;
  credits?: TmdbCredits;
}
