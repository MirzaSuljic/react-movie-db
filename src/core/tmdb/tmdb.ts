import type { CastMember, Media, MediaDetails, MediaFact, MediaListId, MediaType, PagedResult } from '../../shared/types';
import { monthRange } from '../../shared/utils/calendar';
import { formatDate, formatMoney, formatRuntime, languageName } from '../../shared/utils/format';
import { TMDB_API_KEY, TMDB_API_URL, TMDB_IMAGE_URL } from '../config';
import type { TmdbCredits, TmdbDetailsBase, TmdbListItem, TmdbMovie, TmdbPage, TmdbTvShow } from './models';

const PAGE_SIZE = 20;
const MAX_PAGES = 500;

async function get<T>(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> {
  const query = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'en-US', ...params });
  const response = await fetch(`${TMDB_API_URL}${path}?${query}`, { signal });
  if (!response.ok) {
    throw new Error(`TMDB responded with ${response.status}`);
  }
  return (await response.json()) as T;
}

function countPages(res: TmdbPage): number {
  return Math.min(res.total_pages, Math.ceil(res.total_results / PAGE_SIZE), MAX_PAGES);
}

export function toMedia(item: TmdbListItem, type: MediaType): Media {
  return {
    id: item.id,
    type,
    title: item.title ?? item.name ?? 'Untitled',
    posterPath: item.poster_path ?? null,
    releaseDate: item.release_date || item.first_air_date || null,
    voteAverage: item.vote_average ?? 0,
    voteCount: item.vote_count ?? 0,
  };
}

export async function fetchList(
  type: MediaType,
  list: MediaListId,
  query: string,
  page: number,
  signal?: AbortSignal,
): Promise<PagedResult<Media>> {
  if (page > MAX_PAGES) {
    return { page, totalPages: MAX_PAGES, totalResults: 0, results: [] };
  }
  const path = query ? `/search/${type}` : `/${type}/${list}`;
  const params: Record<string, string> = { page: String(page), include_adult: 'false' };
  if (query) {
    params.query = query;
  }
  const res = await get<TmdbPage>(path, params, signal);
  return {
    page: res.page,
    totalPages: countPages(res),
    totalResults: res.total_results,
    results: res.results.map(item => toMedia(item, type)),
  };
}

export async function fetchReleases(
  type: MediaType,
  month: string,
  signal?: AbortSignal,
  pages = 3,
): Promise<PagedResult<Media>> {
  const [first, last] = monthRange(month);
  const field = type === 'movie' ? 'primary_release_date' : 'first_air_date';
  const params: Record<string, string> = {
    [`${field}.gte`]: first,
    [`${field}.lte`]: last,
    sort_by: 'popularity.desc',
    include_adult: 'false',
    ...(type === 'movie' ? { include_video: 'false' } : { include_null_first_air_dates: 'false' }),
  };
  const responses = await Promise.all(
    Array.from({ length: pages }, (_, i) =>
      get<TmdbPage>(`/discover/${type}`, { ...params, page: String(i + 1) }, signal),
    ),
  );
  const seen = new Set<number>();
  const results: Media[] = [];
  for (const item of responses.flatMap(r => r.results)) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      results.push(toMedia(item, type));
    }
  }
  return { page: 1, totalPages: countPages(responses[0]), totalResults: responses[0].total_results, results };
}

function toCast(credits: TmdbCredits | undefined): CastMember[] {
  return (credits?.cast ?? []).slice(0, 12).map(c => ({
    creditId: c.credit_id,
    name: c.name,
    character: c.character,
    profilePath: c.profile_path,
  }));
}

function facts(entries: [string, string | number | null | undefined][]): MediaFact[] {
  return entries
    .filter(([, value]) => value !== null && value !== undefined && value !== '' && value !== 0)
    .map(([label, value]) => ({ label, value: String(value) }));
}

function common(raw: TmdbDetailsBase) {
  return {
    id: raw.id,
    tagline: raw.tagline || null,
    overview: raw.overview,
    genres: raw.genres.map(g => g.name),
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    cast: toCast(raw.credits),
  };
}

function toMovieDetails(raw: TmdbMovie): MediaDetails {
  return {
    ...common(raw),
    type: 'movie',
    title: raw.title,
    originalTitle: raw.original_title !== raw.title ? raw.original_title : null,
    releaseDate: raw.release_date || null,
    runtime: formatRuntime(raw.runtime),
    facts: facts([
      ['Release date', formatDate(raw.release_date)],
      ['Status', raw.status],
      ['Original language', languageName(raw.original_language)],
      ['Budget', formatMoney(raw.budget)],
      ['Box office', formatMoney(raw.revenue)],
    ]),
  };
}

function toTvDetails(raw: TmdbTvShow): MediaDetails {
  const episodeLength = formatRuntime(raw.episode_run_time?.[0]);
  return {
    ...common(raw),
    type: 'tv',
    title: raw.name,
    originalTitle: raw.original_name !== raw.name ? raw.original_name : null,
    releaseDate: raw.first_air_date || null,
    runtime: episodeLength ? `${episodeLength} per episode` : null,
    facts: facts([
      ['First aired', formatDate(raw.first_air_date)],
      ['Last episode', formatDate(raw.last_episode_to_air?.air_date)],
      ['Next episode', formatDate(raw.next_episode_to_air?.air_date)],
      ['Seasons', raw.number_of_seasons],
      ['Episodes', raw.number_of_episodes],
      ['Status', raw.status],
      ['Network', raw.networks?.map(n => n.name).join(', ')],
    ]),
  };
}

export async function fetchDetails(type: MediaType, id: number, signal?: AbortSignal): Promise<MediaDetails> {
  const params = { append_to_response: 'credits' };
  return type === 'movie'
    ? toMovieDetails(await get<TmdbMovie>(`/movie/${id}`, params, signal))
    : toTvDetails(await get<TmdbTvShow>(`/tv/${id}`, params, signal));
}

export function imageUrl(path: string | null, size: string): string | null {
  return path ? `${TMDB_IMAGE_URL}/${size}${path}` : null;
}
