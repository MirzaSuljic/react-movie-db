import type { TmdbDetailsBase } from './tmdb-details-base';
import type { TmdbEpisode } from './tmdb-episode';
import type { TmdbNetwork } from './tmdb-network';

export interface TmdbTvShow extends TmdbDetailsBase {
  name: string;
  original_name: string;
  first_air_date: string;
  episode_run_time?: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  last_episode_to_air?: TmdbEpisode | null;
  next_episode_to_air?: TmdbEpisode | null;
  networks?: TmdbNetwork[];
}
