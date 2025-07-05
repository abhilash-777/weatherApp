var weatherApi = "/weather";

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const weatherIcon = document.querySelector(".weatherIcon i");
const weatherCondition = document.querySelector(".weatherCondition");
const tempElement = document.querySelector(".temperature span");

const locationElement = document.querySelector(".place");
const dateElement = document.querySelector(".date");

const currentDate = new Date();
const options = { month: "long" };
const monthName = currentDate.toLocaleString("en-US", options);
dateElement.textContent = new Date().getDate() + ", " + monthName;

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //   console.log(search.value);
  const cityName = search.value.trim();

  if(!cityName){
    alert("Please enter city name");
    return;
  }
  console.log("city name",cityName);

  locationElement.textContent = "Loading...";
  weatherIcon.className = "";
  tempElement.textContent = "";
  weatherCondition.textContent = "";

  showData(cityName);
});

if ("geolocation" in navigator) {
  locationElement.textContent = "Loading...";
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
      
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.address && data.address.city) {
            const city = data.address.city;
            showData(city);
          } else {
            console.error("City not found in location data.");
            locationElement.textContent = "Location not found";
          }
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
          locationElement.textContent = "Error getting location";
        });
    },
    function (error) {
      console.error("Error getting location:", error.message);
      locationElement.textContent = "Location access denied";
    }
  );
} else {
  console.error("Geolocation is not available in this browser.");
  locationElement.textContent = "Enter a city name";
}

function showData(city) {
  console.log("showData called with:", city); // Debug log
  
  getWeatherData(city, (result) => {
    console.log("Weather data received:", result); // Debug log
    
    if (result.cod == 200) {
      // Fix the weather icon logic
      const weatherDescription = result.weather[0].main.toLowerCase();
      
      if (weatherDescription.includes("rain")) {
        weatherIcon.className = "wi wi-day-rain";
      } else if (weatherDescription.includes("cloud")) {
        weatherIcon.className = "wi wi-day-cloudy";
      } else if (weatherDescription.includes("clear")) {
        weatherIcon.className = "wi wi-day-sunny";
      } else if (weatherDescription.includes("snow")) {
        weatherIcon.className = "wi wi-day-snow";
      } else if (weatherDescription.includes("fog") || weatherDescription.includes("mist")) {
        weatherIcon.className = "wi wi-day-fog";
      } else {
        weatherIcon.className = "wi wi-day-cloudy";
      }
      
      locationElement.textContent = result?.name + ", " + result?.sys?.country;
      tempElement.textContent = (result?.main?.temp - 273.15).toFixed(1) + "°C";
      weatherCondition.textContent = result?.weather[0]?.description?.toUpperCase();
    } else {
      locationElement.textContent = "City not found.";
      weatherIcon.className = "";
      tempElement.textContent = "";
      weatherCondition.textContent = "";
    }
  });
}

function getWeatherData(city, callback) {
    const locationApi = weatherApi + "?address=" + encodeURIComponent(city);
  
    console.log("Fetching from:", locationApi); // Debug log
  
    fetch(locationApi)
    .then((response) => {
        console.log("Response status:", response.status); // Debug log
      
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        return response.json();
    })
    .then((data) => {
        console.log("Parsed data:", data); // Debug log
        callback(data);
    })
    .catch((error) => {
        console.error("Error fetching weather data:", error);
        locationElement.textContent = "Error fetching weather data";
    });
}