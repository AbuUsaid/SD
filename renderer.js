const { ipcRenderer } = require('electron');

document.getElementById('shutdown-button').addEventListener('click', () => {
  ipcRenderer.send('shutdown-pc');
});
