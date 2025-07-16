import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Navigation from './components/Navigation';
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import { SettingsProvider } from './SettingsContext';
const App = () => {
    const [currentPage, setCurrentPage] = useState('main');
    let content;
    switch (currentPage) {
        case 'main':
            content = _jsx(MainPage, {});
            break;
        case 'about':
            content = _jsx(AboutPage, {});
            break;
        case 'settings':
            content = _jsx(SettingsPage, {});
            break;
        case 'help':
            content = _jsx(HelpPage, {});
            break;
        default:
            content = null;
    }
    return (_jsxs(SettingsProvider, { children: [_jsxs("div", { style: { display: 'flex', height: '100vh', minHeight: 0, margin: '0 auto', marginLeft: '15%' }, children: [_jsx(Navigation, { currentPage: currentPage, onNavigate: setCurrentPage }), _jsx("main", { style: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, padding: 32, overflow: 'auto' }, children: _jsx("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0 }, children: content }) })] })] }));
};
export default App;
