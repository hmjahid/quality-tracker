import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme, getSystemTheme } from './theme';
import CircularProgress from '@mui/material/CircularProgress';

declare global {
  interface Window {
    electronAPI: {
      getStoreValue: (key: string) => Promise<any>;
      setStoreValue: (key: string, value: any) => Promise<void>;
    };
  }
}

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextProps {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextProps>({ mode: 'system', setMode: () => {} });

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [muiMode, setMuiMode] = useState<'light' | 'dark'>(getSystemTheme());
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const storedMode = await window.electronAPI.getStoreValue('themeMode');
      setMode(storedMode || 'system');
      setInitialized(true);
    })();
  }, []);

  useEffect(() => {
    if (initialized) window.electronAPI.setStoreValue('themeMode', mode);
    if (mode === 'system') {
      setMuiMode(getSystemTheme());
    } else {
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

  if (!initialized) return <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><CircularProgress /></div>;

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={muiMode === 'dark' ? darkTheme : lightTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}; 