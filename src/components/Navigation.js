import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
const navItems = [
    { label: 'Main', icon: _jsx(HomeIcon, {}), page: 'main' },
    { label: 'About', icon: _jsx(InfoIcon, {}), page: 'about' },
    { label: 'Settings', icon: _jsx(SettingsIcon, {}), page: 'settings' },
    { label: 'Help', icon: _jsx(HelpIcon, {}), page: 'help' },
];
const Navigation = ({ currentPage, onNavigate }) => (_jsx(Drawer, { variant: "permanent", anchor: "left", children: _jsx(List, { children: navItems.map((item) => (_jsxs(ListItem, { button: true, selected: currentPage === item.page, onClick: () => onNavigate(item.page), children: [_jsx(ListItemIcon, { children: item.icon }), _jsx(ListItemText, { primary: item.label })] }, item.page))) }) }));
export default Navigation;
