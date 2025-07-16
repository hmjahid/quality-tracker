import React, { useState } from 'react';
import Navigation, { Page } from './components/Navigation';
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import { SettingsProvider } from './SettingsContext';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('main');

  let content;
  switch (currentPage) {
    case 'main':
      content = <MainPage />;
      break;
    case 'about':
      content = <AboutPage />;
      break;
    case 'settings':
      content = <SettingsPage />;
      break;
    case 'help':
      content = <HelpPage />;
      break;
    default:
      content = null;
  }

  return (
    <SettingsProvider>
      <div style={{ display: 'flex', height: '100vh', marginLeft: '15%', minHeight: 0, boxSizing: 'border-box' }}>
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          padding: 32,
          overflow: 'auto',
          width: '80%',
          margin: '0 auto',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, width: '100%' }}>
            {content}
          </div>
        </main>
      </div>
    </SettingsProvider>
  );
};

export default App; 