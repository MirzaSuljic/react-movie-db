export type MovieListId = 'popular' | 'now_playing' | 'upcoming' | 'top_rated';
export type TvListId = 'popular' | 'airing_today' | 'on_the_air' | 'top_rated';
export type MediaListId = MovieListId | TvListId;

export interface MediaListOption {
  id: MediaListId;
  label: string;
  heading: string;
}
