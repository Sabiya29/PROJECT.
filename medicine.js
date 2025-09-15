const form = document.getElementById('medicineForm');
const medicineList = document.getElementById('medicineList');
const uploadForm = document.getElementById('uploadForm');

let medicines = []; // Store medicines locally
let reminderInterval;

// Add medicine
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('medicineName').value;
    const time = document.getElementById('medicineTime').value;

    medicines.push({name: name, time: time, uploaded: false});
    updateList();

    // Send to backend
    fetch('http://localhost:5000/add_medicine', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, time})
    });

    form.reset();

    // Start reminder if not already running
    if (!reminderInterval) {
        startReminder();
    }
});

// Update medicine list on UI
function updateList() {
    medicineList.innerHTML = '';
    medicines.forEach((med, index) => {
        const li = document.createElement('li');
        li.textContent = ${med.name} at ${med.time} - Image Uploaded: ${med.uploaded};
        medicineList.appendChild(li);
    });
}

// Upload medicine image
uploadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('medicineImage');
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    fetch('http://localhost:5000/upload_image', {
        method: 'POST',
        body: formData
    }).then(res => res.json())
      .then(data => {
          alert(data.message);
          // Mark all medicines as uploaded
          medicines = medicines.map(med => ({...med, uploaded: true}));
          updateList();
      });

    uploadForm.reset();
});

// Reminder every 2 minutes
function startReminder() {
    reminderInterval = setInterval(() => {
        medicines.forEach(med => {
            if (!med.uploaded) {
                alert(Reminder: Take your medicine ${med.name} at ${med.time});
            }
        });
    }, 120000); // 120000ms = 2 minutes
}