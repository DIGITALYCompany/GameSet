import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { applyReducedMotion, getSettings } from '@/lib/storage';
import './index.css';

applyReducedMotion(getSettings().reducedMotion);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
