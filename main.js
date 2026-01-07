const { create } = require('domain');
const {app, BrowserWindow } = require('electron');
const path = require('path');
require('update-electron-app')();

function createWindow() {
     const win = new BrowserWindow({
          title: 'FlyingTODO',
          icon: path.join(__dirname, 'img/iconeflyingtodo.ico'),
          width: 800,
          height: 600,
          webPreferences: {
               nodeIntegration: true
          }
     });

     win.loadFile('templates/index.html');
     win.setMenuBarVisibility(false);
};

app.whenReady().then(() => {
     createWindow();

     app.on('activate', () => {
          if (BrowserWindow.getAllWindows().length === 0) createWindow();
     });
});

app.on('window-all-closed', () => {
     if (process.platform !== 'darwin') app.quit();
});