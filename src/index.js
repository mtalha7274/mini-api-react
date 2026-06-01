import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './theme/ThemeContext';
import { CollectionProvider } from './context/CollectionContext/CollectionContext';
import { getInitialTheme } from './theme/themeStorage';

if (getInitialTheme() === 'dark') {
  document.documentElement.classList.add('dark');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <CollectionProvider>
        <App />
      </CollectionProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
