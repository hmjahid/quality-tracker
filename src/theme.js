import { createTheme } from '@mui/material/styles';
export const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});
export function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}
