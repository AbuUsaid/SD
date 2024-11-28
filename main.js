const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true, // Keep the frame to have minimize, maximize, and close buttons
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Create a custom menu with no options
  const menu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(menu); // Set the custom menu

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

// Listen for the schedule sleep event
ipcMain.on('schedule-sleep', (event, minutes) => {
  const seconds = minutes * 60;
  // Use timeout to wait before executing the sleep command
  setTimeout(() => {
    exec(
      'rundll32.exe powrprof.dll,SetSuspendState 0,1,0',
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error scheduling sleep: ${error}`);
          return;
        }
        console.log(`Sleep scheduled in ${minutes} minutes: ${stdout}`);
      }
    );
  }, seconds * 1000); // Convert seconds to milliseconds
});

// Listen for the cancel shutdown event
ipcMain.on('cancel-shutdown', (event) => {
  exec('shutdown /a', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error canceling shutdown/restart/sleep: ${error}`);
      return;
    }
    console.log(`Shutdown/Restart/Sleep canceled: ${stdout}`);
  });
});
