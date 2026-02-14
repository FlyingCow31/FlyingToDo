const { create } = require('domain');
const {app, BrowserWindow } = require('electron');
const path = require('path');
const { updateElectronApp } = require('update-electron-app');
updateElectronApp();
if (require('electron-squirrel-startup')) app.quit();

app.setAppUserModelId('flyingtodo');
function createWindow() {
     const win = new BrowserWindow({
          title: 'FlyingTODO',
          icon: path.join(__dirname, 'img', 'iconflyingtodovraie.ico'),
          width: 800,
          height: 600,
          webPreferences: {
               nodeIntegration: true,
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