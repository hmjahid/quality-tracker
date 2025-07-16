import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import Store from 'electron-store';
import fs from 'node:fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();

const getPreloadPath = () => {
  const distPreload = path.resolve(__dirname, '../dist/preload.js');
  const srcPreload = path.resolve(__dirname, 'preload.js');
  return fs.existsSync(distPreload) ? distPreload : srcPreload;
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  mainWindow.loadFile(path.resolve(__dirname, '../dist/index.html'));
};

ipcMain.handle('get-store-value', (event, key) => {
  return store.get(key);
});
ipcMain.handle('set-store-value', (event, key, value) => {
  store.set(key, value);
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 