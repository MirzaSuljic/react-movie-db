import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './app/App';
import { ListsProvider } from './shared/context/ListsProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ListsProvider>
        <App />
      </ListsProvider>
    </BrowserRouter>
  </StrictMode>,
);
