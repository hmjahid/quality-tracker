import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme, getSystemTheme } from './theme';
import CircularProgress from '@mui/material/CircularProgress';
const ThemeContext = createContext({ mode: 'system', setMode: () => { } });
export const useThemeMode = () => useContext(ThemeContext);
export const ThemeModeProvider = ({ children }) => {
    const [mode, setMode] = useState('system');
    const [muiMode, setMuiMode] = useState(getSystemTheme());
    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
        (async () => {
            const storedMode = await window.electronAPI.getStoreValue('themeMode');
            setMode(storedMode || 'system');
            setInitialized(true);
        })();
    }, []);
    useEffect(() => {
        if (initialized)
            window.electronAPI.setStoreValue('themeMode', mode);
        if (mode === 'system') {
            setMuiMode(getSystemTheme());
        }
        else {
            setMuiMode(mode);
        }
    }, [mode, initialized]);
    useEffect(() => {
        if (mode === 'system') {
            const listener = () => setMuiMode(getSystemTheme());
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
            return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
        }
    }, [mode]);
    if (!initialized)
        return _jsx("div", { style: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(CircularProgress, {}) });
    return (_jsx(ThemeContext.Provider, { value: { mode, setMode }, children: _jsx(ThemeProvider, { theme: muiMode === 'dark' ? darkTheme : lightTheme, children: children }) }));
};
