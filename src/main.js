const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const Store = require('electron-store');
const store = new Store();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  mainWindow.webContents.openDevTools();
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