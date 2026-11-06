import { Navigate, Route, Routes } from 'react-router';

import { Layout } from './components/Layout';
import { AddPage } from './pages/AddPage';
import { ListPage } from './pages/ListPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<AddPage />} />
        <Route path="watchlist" element={<ListPage key="watchlist" list="watchlist" />} />
        <Route path="watched" element={<ListPage key="watched" list="watched" />} />
        <Route path="add" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
