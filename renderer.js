const { ipcRenderer } = require('electron');

let countdownInterval;

document.getElementById('shutdown-button').addEventListener('click', () => {
  const timerValue = document.getElementById('timer').value;
  if (timerValue) {
    const minutes = parseInt(timerValue);
    const seconds = minutes * 60;
    ipcRenderer.send('schedule-shutdown', timerValue);
    startCountdown(seconds);
  } else {
    alert('Please enter a valid time in minutes.');
  }
});

document.getElementById('restart-button').addEventListener('click', () => {
  const timerValue = document.getElementById('timer').value;
  if (timerValue) {
    const minutes = parseInt(timerValue);
    const seconds = minutes * 60;
    ipcRenderer.send('schedule-restart', timerValue);
    startCountdown(seconds);
  } else {
    alert('Please enter a valid time in minutes.');
  }
});

document.getElementById('cancel-button').addEventListener('click', () => {
  ipcRenderer.send('cancel-shutdown');
  clearInterval(countdownInterval);
  document.getElementById('countdown-display').innerText = ''; // Clear countdown display
});

function startCountdown(seconds) {
  let remainingTime = seconds;

  countdownInterval = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      document.getElementById('countdown-display').innerText =
        'Shutdown in progress...';
    } else {
      const minutes = Math.floor(remainingTime / 60);
      const secs = remainingTime % 60;
      document.getElementById(
        'countdown-display'
      ).innerText = `Time remaining: ${minutes}m ${secs}s`;
      remainingTime--;
    }
  }, 1000);
}
