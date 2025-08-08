const apiKey = "6dac63954a9f5caf74e0326f7a6e7cfa"; // OpenWeatherMap API key

document.getElementById("cityInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const city = e.target.value.trim();
    if (city) {
      getWeather(city);
    }
  }
});

document.getElementById("getWeatherBtn").addEventListener("click", function () {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getWeather(city);
  }
});

async function getWeather(city) {
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!weatherRes.ok) {
      throw new Error("City not found");
    }

    const weatherData = await weatherRes.json();

    // Update DOM
    document.getElementById("location").textContent =
      `${weatherData.name}, ${weatherData.sys.country}`;

    document.getElementById("temperature").textContent =
      `${weatherData.main.temp}°C / ${weatherData.weather[0].main}`;

    const timezoneOffset = weatherData.timezone;
    startCityClock(timezoneOffset);

    // Update weather icon
    const iconCode = weatherData.weather[0].icon;
    document.getElementById("weatherIcon").src =
      `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Update background based on condition
    updateBackground(weatherData.weather[0].main);

    // ✅ Clear input field after search
    document.getElementById("cityInput").value = "";

    // ✅ Get 5-day forecast
    getForecast(city);

  } catch (error) {
    alert("City not found or an error occurred.");
    console.error(error);
  }
}

function updateBackground(condition) {
  const lower = condition.toLowerCase();
  document.body.className = ""; // Reset all classes
  const animBg = document.getElementById("animatedBackground");
  animBg.innerHTML = ""; // Clear old raindrops if any





  // Default background
  let bgClass = "default-bg";

  if (lower.includes("rain")) {
    bgClass = "rain";
    for (let i = 0; i < 100; i++) {
      const drop = document.createElement("div");
      drop.className = "raindrop";
      drop.style.left = Math.random() * 100 + "vw";
      drop.style.top = Math.random() * -100 + "px";
      drop.style.animationDuration = 0.5 + Math.random() * 1.5 + "s";
      animBg.appendChild(drop);
      drop.style.transform = "rotate(20deg)";
    }
  } else if (lower.includes("cloud")) {
    bgClass = "clouds";
  } else if (lower.includes("sun") || lower.includes("clear")) {
    bgClass = "sunny";
  } else if (lower.includes("snow")) {
    bgClass = "snow";
  } else if (lower.includes("thunder")) {
    bgClass = "thunderstorm";
  }

  document.body.classList.add(bgClass);
}









// Clock

let clockInterval;

function startCityClock(offsetInSeconds) {
  clearInterval(clockInterval);

  clockInterval = setInterval(() => {
    const nowUTC = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const cityTime = new Date(nowUTC + offsetInSeconds * 1000);
    const timeStr = cityTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const dateStr = cityTime.toDateString();
    document.getElementById("timeDisplay").textContent = `${timeStr} | ${dateStr}`;
  }, 1000);
}












// ✅ 5-Day Forecast Function
async function getForecast(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!res.ok) {
      throw new Error("Forecast data not available");
    }

    const data = await res.json();

    const forecastList = [];
    const seenDates = new Set();

    data.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      const time = item.dt_txt.split(" ")[1];

      // Pick only 12:00:00 entries once per date
      if (time === "12:00:00" && !seenDates.has(date)) {
        forecastList.push(item);
        seenDates.add(date);
      }
    });

    const forecastListDiv = document.getElementById("forecastList");
    forecastListDiv.innerHTML = "";

    forecastList.forEach(day => {
      const card = document.createElement("div");
      card.className = "forecast-day";

      const date = new Date(day.dt_txt);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });

      card.innerHTML = `
        <div class="day-date">
          <span>${dayName}</span> <span>${dateStr}</span>
        </div>
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="">
        <div class="temp-weather">
          <span>${Math.round(day.main.temp)}°C</span> <span>${day.weather[0].main}</span>
        </div>
      `;

      forecastListDiv.appendChild(card);
    });

  } catch (error) {
    console.error("Forecast error:", error);
  }
}









// Show default weather on first load
window.addEventListener("load", () => {
  getWeather("Delhi");
});
