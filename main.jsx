import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { validarVariaveis } from './config/env.js';
import './styles/themes.css';
import './styles/global.css';

validarVariaveis();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => console.log('SW registrado'))
      .catch((error) => console.warn('SW erro:', error));
  });
} else if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });

    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key));
      });
    }
  });
}

if (import.meta.env.DEV) {
  import('./utils/migrarSenhas.js');
}
