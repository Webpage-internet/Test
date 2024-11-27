// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoqFUvyTQZbOsvAwkEgybh_S7ESxv4_T4",
  authDomain: "ai-husband.firebaseapp.com",
  projectId: "ai-husband",
  storageBucket: "ai-husband.firebasestorage.app",
  messagingSenderId: "552606513853",
  appId: "1:552606513853:web:744828320f9bbc7e14d5d4",
  measurementId: "G-HBJWV8SS5R"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Firebase database reference for the view count
const viewCountRef = firebase.database().ref('viewCount');

// Function to increment view count
function incrementViewCount() {
  viewCountRef.transaction((currentCount) => {
    return (currentCount || 0) + 1; // Increment by 1
  });
}

// Function to display the current view count
function displayViewCount() {
  viewCountRef.on('value', (snapshot) => {
    const count = snapshot.val();
    document.getElementById('count-display').textContent = count || 0;
  });
}

// Unlock button functionality
document.getElementById('unlock-btn').addEventListener('click', function () {
  const password = document.getElementById('password').value.trim().toLowerCase();
  const validPasswords = ["afzal", "mahira", "mahira faisal", "honey", "haney", "hani"];

  if (validPasswords.includes(password)) {
    // Increment the view count in Firebase
    incrementViewCount();

    // Unlock the showcase
    document.getElementById('lock-screen').classList.add('hidden');
    document.getElementById('photo-showcase').classList.remove('hidden');
    document.getElementById('lock-screen').setAttribute('aria-hidden', 'true');
    document.getElementById('photo-showcase').setAttribute('aria-hidden', 'false');

    // Notify user before locking the showcase again
    setTimeout(() => {
      // Apply blur effect to the background
      document.body.classList.add('blur-background');

      // Create a bubble notification element and add to the page
      const bubbleNotification = document.createElement('div');
      bubbleNotification.className = 'bubble-notification';
      bubbleNotification.textContent = "The showcase will lock in 10 seconds!";
      document.body.appendChild(bubbleNotification);

      // The bubble notification stays on the screen for 50 seconds before locking
      setTimeout(() => {
        // Remove blur effect and the bubble notification after 10 seconds
        document.body.classList.remove('blur-background');
        bubbleNotification.remove(); // Remove the bubble notification

        // Lock the showcase
        lockShowcase();
      }, 10000); // Lock after 10 seconds (10,000 milliseconds)

    }, 50000); // Notify after 50 seconds

  } else {
    document.getElementById('error-msg').textContent = "Incorrect name. Please try again!";
  }

  // Reset password field
  document.getElementById('password').value = "";
  document.getElementById('error-msg').textContent = "";

  // Remove the unlocked state from localStorage
  localStorage.removeItem('unlocked');
});

// Function to lock the showcase after timeout
function lockShowcase() {
  document.getElementById('lock-screen').classList.remove('hidden');
  document.getElementById('photo-showcase').classList.add('hidden');
  document.getElementById('lock-screen').setAttribute('aria-hidden', 'false');
  document.getElementById('photo-showcase').setAttribute('aria-hidden', 'true');

  // Reset the background color to default (or any other color you prefer)
  document.body.style.backgroundColor = "";
}

// Reset view button functionality
document.getElementById('reset-view').addEventListener('click', function () {
  const enteredPassword = prompt("Enter the password to reset views:");
  if (enteredPassword === "143") {
    viewCountRef.set(0); // Reset the view count in Firebase
    alert("View count has been reset!");
  } else {
    alert("Incorrect password. Unable to reset views.");
  }
});

// Function to get user's live location
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`User's Location: Latitude ${latitude}, Longitude ${longitude}`);

        // Optional: Store the location in Firebase
        const locationRef = firebase.database().ref('userLocations');
        locationRef.push({
          latitude,
          longitude,
          timestamp: new Date().toISOString()
        });

        // Optional: Display the location on the webpage
        const locationDisplay = document.createElement('p');
        locationDisplay.textContent = `Your location: Latitude ${latitude}, Longitude ${longitude}`;
        document.body.appendChild(locationDisplay);
      },
      (error) => {
        console.error("Error obtaining location:", error.message);
        alert("Unable to access location. Please enable location services.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Initialize the view count display and location tracking on page load
document.addEventListener('DOMContentLoaded', () => {
  displayViewCount();
  getUserLocation();
});