const apiKey = "YOUR_API_KEY";

async function getWeather() {
  const city = document.getElementById("searchInput").value;
  if (!city) return;

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    updateWeatherCard(data);
  } catch (error) {
    alert(error.message);
    document.getElementById("weatherCard").classList.add("hidden");
  }
}

function updateWeatherCard(data) {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString();
  document.getElementById("currentTime").textContent = formattedTime;
  document.getElementById("cityName").textContent = data.name;
  document.getElementById("temperature").textContent = data.main.temp;
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("weatherCard").classList.remove("hidden");
  document.getElementById("feelsLike").textContent = data.main.feels_like;
  console.log(data);
}


// Theme Toggle
if (toggleTheme) {
  toggleTheme.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    // Save theme preference
    const isDarkMode = document.body.classList.contains("dark-mode");
    toggleTheme.textContent = isDarkMode ? "☀️" : "🌙";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  });

  // Load theme preference on page load
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    toggleTheme.textContent = "☀️";
  }
}
