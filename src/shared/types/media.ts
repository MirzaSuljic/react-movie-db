import type { MediaType } from './media-type';

export interface Media {
  id: number;
  type: MediaType;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
  voteCount: number;
}
