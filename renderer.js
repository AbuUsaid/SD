const { ipcRenderer } = require('electron');

let countdownInterval;

document.getElementById('action').addEventListener('change', (event) => {
  const selectedAction = event.target.value;
  const timerValue = document.getElementById('timer').value;

  // dislay start button only after selection
  document.getElementById('start-button').style.display =
    selectedAction && timerValue ? 'inline-block' : 'none';
});

document.getElementById('start-button').addEventListener('click', () => {
  const selectedAction = document.getElementById('action').value;
  const timerValue = document.getElementById('timer').value;

  if (timerValue) {
    const minutes = parseInt(timerValue);
    const seconds = minutes * 60;

    // Send the appropriate IPC message based on the selected action
    if (selectedAction === 'shutdown') {
      ipcRenderer.send('schedule-shutdown', timerValue);
    } else if (selectedAction === 'restart') {
      ipcRenderer.send('schedule-restart', timerValue);
    } else if (selectedAction === 'sleep') {
      ipcRenderer.send('schedule-sleep', timerValue);
    }

    startCountdown(seconds);
  } else {
    alert('Please enter a valid time in minutes.');
  }
});

document.getElementById('cancel-button').addEventListener('click', () => {
  ipcRenderer.send('cancel-shutdown');
  clearInterval(countdownInterval);
  document.getElementById('countdown-display').innerText = ''; // Clear countdown display

  document.getElementById('start-button').style.display = 'none'; // Hide the Start button
  document.getElementById('action').value = ''; // Reset the dropdown
  document.getElementById('cancel-button').style.display = 'none'; // Hide the Cancel button
});

function startCountdown(seconds) {
  let remainingTime = seconds;

  // Show the Cancel button when the countdown starts
  document.getElementById('cancel-button').style.display = 'inline-block';

  countdownInterval = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      document.getElementById('countdown-display').innerText =
        'Action in progress...';
      document.getElementById('cancel-button').style.display = 'none'; // Hide the Cancel button after action starts
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
