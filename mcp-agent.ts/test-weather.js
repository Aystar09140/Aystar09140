const axios = require('axios');
require('dotenv').config();

async function testWeather() {
  try {
    const city = "Benin City, Nigeria";
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    console.log(`🌤️ Getting weather for: ${city}`);
    console.log(`Using API key: ${apiKey.substring(0, 8)}...`);
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    
    const data = response.data;
    console.log('\n🌤️ CURRENT WEATHER IN BENIN CITY, NIGERIA:');
    console.log('==========================================');
    console.log(`📍 Location: ${data.name}, ${data.sys.country}`);
    console.log(`🌡️ Temperature: ${data.main.temp}°C`);
    console.log(`🌡️ Feels like: ${data.main.feels_like}°C`);
    console.log(`☁️ Weather: ${data.weather[0].description}`);
    console.log(`💧 Humidity: ${data.main.humidity}%`);
    console.log(`💨 Wind: ${data.wind.speed} m/s`);
    console.log(`👁️ Visibility: ${data.visibility ? (data.visibility/1000).toFixed(1) + ' km' : 'N/A'}`);
    console.log(`🌅 Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`);
    console.log(`🌇 Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`);
    
  } catch (error) {
    console.error('❌ Error getting weather:', error.response?.data?.message || error.message);
  }
}

testWeather();
