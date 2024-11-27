const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, //important for using ipcRenderer
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Listen for the shutdown event
ipcMain.on('shutdown-pc', (event) => {
  exec('shutdown /s /t 0', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error shutting down: ${error}`);
      return;
    }
    console.log(`Shutdown command executed: ${stdout}`);
  });
});
