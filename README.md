# Watchlist

Keep track of the movies and TV shows you want to see and the ones you've already watched. Browse TMDB's lists or search by title, open any title for its details, see what's premiering each month, and move things to Watched once you've seen them.

Built with React 19, TypeScript, React Router 7 and Tailwind CSS 4, on Vite. Movie and TV data comes from [TMDB](https://www.themoviedb.org).

## Features

- **Movies** (the home page): TMDB's Popular, Now playing, Upcoming and Top rated lists, or search by title as you type
- **TV shows**: Popular, Airing today, On TV and Top rated, with the same search
- **Details**: every poster opens a page with the backdrop, rating, tagline, overview, key facts (budget and box office for movies; seasons, episodes and network for shows) and the cast. The back link returns to the exact list, page or month you came from.
- **Calendar**: a month grid of movie releases or new series premieres, with the agenda for each day below it. Switch between Movies and TV shows and move between months.
- **Pagination**: a compact pager above the results and numbered pages below. The list, search, page and month are all kept in the URL, so every view can be shared and the back button works.
- **To watch** and **Watched** lists: hold both movies and TV shows, filterable by type. Mark something as watched, move it back, or remove it, from a card or from the details page. The counts in the header update right away.
- **Saved in the browser**: both lists are stored in `localStorage`, and lists saved by the first version of the app still load.
- **Clear states**: loading placeholders, an empty-list message with a link to find movies, a "no results" message and a retry button when TMDB can't be reached
- **Accessible and responsive**: works down to phone width, keyboard focus is always visible, and every button names the movie it acts on for screen readers

## Tech stack

| Area | Choice |
|---|---|
| UI | React 19 with function components and hooks; list state in `useReducer` and context |
| Language | TypeScript (strict) |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4, with the theme in `src/index.css` |
| Build | Vite |
| Tests | Vitest |
| Linting | ESLint 9 with typescript-eslint, react-hooks and react-refresh |

## Getting started

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open http://localhost:5173.

### TMDB API key

The key is set in `src/core/config.ts`. To use your own, create a `.env` file:

```
VITE_TMDB_KEY=your_tmdb_api_key
```

You can get a free key in your [TMDB account settings](https://www.themoviedb.org/settings/api).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server |
| `npm run build` | Type-checks and builds into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm test` | Runs the unit tests |
| `npm run lint` | Lints the project |

## Project structure

```
src/
├── main.tsx                 Entry point: router and lists provider
├── index.css                Tailwind and theme tokens
├── app/
│   ├── App.tsx              Routes
│   └── Layout.tsx           Header, navigation and footer
├── core/
│   ├── config.ts            TMDB key and URLs
│   └── tmdb/
│       ├── tmdb.ts          Lists, search, monthly releases and details, mapped to app types
│       └── models/          Raw TMDB response types, one per file
├── features/
│   ├── browse/              BrowsePage (movies and TV shows)
│   ├── calendar/            CalendarPage
│   ├── detail/              DetailPage
│   └── lists/               ListPage (to watch / watched)
└── shared/
    ├── components/          Poster card, grid, list actions, pagination, error box, icons, styles
    ├── context/             Lists context and provider (saved to localStorage)
    ├── hooks/               useLists, useFetch
    ├── types/               Media, MediaDetails, CastMember, CalendarDay, …, one per file
    └── utils/               List reducer, calendar, pagination, formatting, with tests
```

### Routes

| Path | Page |
|---|---|
| `/` | Movies (`?list=`, `?q=`, `?page=`) |
| `/tv` | TV shows (same parameters) |
| `/movie/:id`, `/tv/:id` | Details |
| `/calendar` | Releases by month (`?type=tv`, `?month=2026-12`) |
| `/watchlist`, `/watched` | Your lists (`?type=movie` or `?type=tv`) |

Old `/add` links go to `/`.

## Deployment

`public/_redirects` sends every path to `index.html`, so routes work on Netlify.

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.
