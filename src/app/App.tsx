import { Navigate, Route, Routes } from 'react-router';

import { BrowsePage } from '../features/browse/BrowsePage';
import { CalendarPage } from '../features/calendar/CalendarPage';
import { DetailPage } from '../features/detail/DetailPage';
import { ListPage } from '../features/lists/ListPage';
import { Layout } from './Layout';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<BrowsePage key="movie" type="movie" />} />
        <Route path="tv" element={<BrowsePage key="tv" type="tv" />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="movie/:id" element={<DetailPage key="movie" type="movie" />} />
        <Route path="tv/:id" element={<DetailPage key="tv" type="tv" />} />
        <Route path="watchlist" element={<ListPage key="watchlist" list="watchlist" />} />
        <Route path="watched" element={<ListPage key="watched" list="watched" />} />
        <Route path="movies" element={<Navigate to="/" replace />} />
        <Route path="add" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
