import type { CastMember } from './cast-member';
import type { Media } from './media';
import type { MediaFact } from './media-fact';

export interface MediaDetails extends Media {
  originalTitle: string | null;
  tagline: string | null;
  overview: string;
  runtime: string | null;
  genres: string[];
  backdropPath: string | null;
  facts: MediaFact[];
  cast: CastMember[];
}
