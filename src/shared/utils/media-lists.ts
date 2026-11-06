import type { MediaListId, MediaListOption, MediaType } from '../types';

export const DEFAULT_MEDIA_LIST: MediaListId = 'top_rated';

export const MEDIA_LISTS: Record<MediaType, MediaListOption[]> = {
  movie: [
    { id: 'popular', label: 'Popular', heading: 'Popular movies' },
    { id: 'now_playing', label: 'Now playing', heading: 'Now in cinemas' },
    { id: 'upcoming', label: 'Upcoming', heading: 'Coming to cinemas' },
    { id: 'top_rated', label: 'Top rated', heading: 'Top rated movies' },
  ],
  tv: [
    { id: 'popular', label: 'Popular', heading: 'Popular TV shows' },
    { id: 'airing_today', label: 'Airing today', heading: 'Airing today' },
    { id: 'on_the_air', label: 'On TV', heading: 'On TV this week' },
    { id: 'top_rated', label: 'Top rated', heading: 'Top rated TV shows' },
  ],
};

export function toMediaList(type: MediaType, value: string | null): MediaListOption {
  const lists = MEDIA_LISTS[type];
  return lists.find(l => l.id === value) ?? lists.find(l => l.id === DEFAULT_MEDIA_LIST) ?? lists[0];
}
