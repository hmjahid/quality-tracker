import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeModeProvider } from './ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';

console.log("Renderer entry loaded");

const root = createRoot(document.getElementById('root')!);
root.render(
  <ThemeModeProvider>
    <CssBaseline />
    <App />
  </ThemeModeProvider>
); 