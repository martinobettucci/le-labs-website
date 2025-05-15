import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { DataProvider } from './contexts/DataContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { MotionConfig } from 'framer-motion';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <DataProvider>
          <UserPreferencesProvider>
            <NotificationsProvider>
              <App />
            </NotificationsProvider>
          </UserPreferencesProvider>
        </DataProvider>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>
);