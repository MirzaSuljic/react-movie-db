import type { TmdbDetailsBase } from './tmdb-details-base';

export interface TmdbMovie extends TmdbDetailsBase {
  title: string;
  original_title: string;
  release_date: string;
  runtime: number | null;
  budget: number;
  revenue: number;
}
