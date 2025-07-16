import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';

export type Page = 'main' | 'about' | 'settings' | 'help';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { label: 'Main', icon: <HomeIcon />, page: 'main' },
  { label: 'About', icon: <InfoIcon />, page: 'about' },
  { label: 'Settings', icon: <SettingsIcon />, page: 'settings' },
  { label: 'Help', icon: <HelpIcon />, page: 'help' },
];

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => (
  <Drawer variant="permanent" anchor="left">
    <List>
      {navItems.map((item) => (
        <ListItem
          button
          key={item.page}
          selected={currentPage === item.page}
          onClick={() => onNavigate(item.page as Page)}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
    </List>
  </Drawer>
);

export default Navigation; 