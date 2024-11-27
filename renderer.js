const { ipcRenderer } = require('electron');

document.getElementById('shutdown-button').addEventListener('click', () => {
  const timerValue = document.getElementById('timer').value;
  if (timerValue) {
    ipcRenderer.send('schedule-shutdown', timerValue);
  } else {
    alert('Please enter a valid time in minutes.');
  }
});

document.getElementById('cancel-button').addEventListener('click', () => {
  ipcRenderer.send('cancel-shutdown');
});
