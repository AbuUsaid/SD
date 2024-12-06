const { ipcRenderer } = require('electron');

let countdownInterval;

// Retrieve the last timer value from localStorage and set it as the default value
document.addEventListener('DOMContentLoaded', () => {
  const lastTimerValue = localStorage.getItem('lastTimerValue');
  const lastActionValue = localStorage.getItem('lastActionValue');

  if (lastTimerValue) {
    document.getElementById('timer').value = lastTimerValue; // Set the input value
  }

  if (lastActionValue) {
    document.getElementById('action').value = lastActionValue; // Set the dropdown value
  }

  // Check if both lastTimerValue and lastActionValue are present
  if (lastTimerValue && lastActionValue) {
    document.getElementById('start-button').style.display = 'inline-block'; // Show Start button
  }
});

document.getElementById('action').addEventListener('change', (event) => {
  const selectedAction = event.target.value;
  const timerValue = document.getElementById('timer').value;

  // Save the selected action to localStorage
  localStorage.setItem('lastActionValue', selectedAction); // Save action

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

    // Save the timer value to localStorage
    localStorage.setItem('lastTimerValue', timerValue);

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

  // Clear the last action from localStorage
  localStorage.removeItem('lastActionValue'); // Clear action

  // Show the timer input and label again
  document.getElementById('timer').style.display = 'inline-block';
  document.querySelector('label[for="timer"]').style.display = 'inline-block';
});

function startCountdown(seconds) {
  let remainingTime = seconds;

  // Show the Cancel button when the countdown starts
  document.getElementById('cancel-button').style.display = 'inline-block';

  // Hide the timer input and label when the countdown starts
  document.getElementById('timer').style.display = 'none';
  document.querySelector('label[for="timer"]').style.display = 'none';

  // Hide the Start button when the countdown starts
  document.getElementById('start-button').style.display = 'none';

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
