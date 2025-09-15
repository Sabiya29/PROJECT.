let reminders = [];

document.getElementById("reminderForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let name = document.getElementById("medicineName").value;
  let time = document.getElementById("reminderTime").value;

  reminders.push({ name, time, notified: false });
  displayReminders();

  document.getElementById("reminderForm").reset();
});

// Display reminders
function displayReminders() {
  let list = document.getElementById("reminders");
  list.innerHTML = "";

  reminders.forEach(reminder => {
    let li = document.createElement("li");
    li.textContent = ${reminder.name} at ${reminder.time};
    if (reminder.notified) {
      li.classList.add("due");
    }
    list.appendChild(li);
  });
}

// Check every minute for reminders
setInterval(() => {
  let now = new Date();
  let currentTime = now.toTimeString().slice(0,5); // HH:MM

  reminders.forEach(reminder => {
    if (reminder.time === currentTime && !reminder.notified) {
      alert(⏰ Time to take your medicine: ${reminder.name});
      reminder.notified = true;
      displayReminders();
    }
  });
}, 1000 * 30); // check every 30 seconds