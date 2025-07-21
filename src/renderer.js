import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Add browser fallback for window.electronAPI
if (typeof window !== 'undefined' && !window.electronAPI) {
    window.electronAPI = {
        getStoreValue: async () => null,
        setStoreValue: async () => { },
        // Add other methods as needed for browser testing
    };
}
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeModeProvider } from './ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
console.log("Renderer entry loaded");
const root = createRoot(document.getElementById('root'));
root.render(_jsxs(ThemeModeProvider, { children: [_jsx(CssBaseline, {}), _jsx(App, {})] }));
