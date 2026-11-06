import type { TmdbListItem } from './tmdb-list-item';

export interface TmdbPage {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbListItem[];
}
