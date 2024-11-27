const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');

// let shutdownTimer;
let countdownInterval;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
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

// Listen for the schedule shutdown event
ipcMain.on('schedule-shutdown', (event, minutes) => {
  const seconds = minutes * 60;
  exec(`shutdown /s /t ${seconds}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error scheduling shutdown: ${error}`);
      return;
    }
    console.log(`Shutdown scheduled in ${minutes} minutes: ${stdout}`);
  });
});

// Listen for the schedule restart event
ipcMain.on('schedule-restart', (event, minutes) => {
  const seconds = minutes * 60;
  exec(`shutdown /r /t ${seconds}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error scheduling restart: ${error}`);
      return;
    }
    console.log(`Restart scheduled in ${minutes} minutes: ${stdout}`);
  });
});

// Listen for the cancel shutdown event
ipcMain.on('cancel-shutdown', (event) => {
  exec('shutdown /a', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error canceling shutdown: ${error}`);
      return;
    }
    console.log(`Shutdown canceled: ${stdout}`);
  });
});
