const axios = require('axios');
require('dotenv').config();

async function getWeatherInfo() {
  try {
    const city = "Benin City, Nigeria";
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    console.log(`🌤️ Getting current weather for: ${city}`);
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    
    const data = response.data;
    console.log('\n🌤️ CURRENT WEATHER:');
    console.log('==================');
    console.log(`📍 ${data.name}, ${data.sys.country}`);
    console.log(`🌡️ ${data.main.temp}°C (feels like ${data.main.feels_like}°C)`);
    console.log(`☁️ ${data.weather[0].description}`);
    console.log(`💧 Humidity: ${data.main.humidity}%`);
    console.log(`💨 Wind: ${data.wind.speed} m/s`);
    
  } catch (error) {
    console.error('❌ Weather error:', error.response?.data?.message || error.message);
  }
}

async function getNewsInfo() {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    console.log('\n📰 Getting latest news...');
    
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&category=general&apiKey=${apiKey}`
    );
    
    const data = response.data;
    console.log('\n📰 LATEST NEWS:');
    console.log('===============');
    console.log(`📊 ${data.totalResults} articles found`);
    
    data.articles.slice(0, 3).forEach((article, index) => {
      console.log(`\n${index + 1}. ${article.title}`);
      console.log(`   📰 ${article.source.name} | ${new Date(article.publishedAt).toLocaleString()}`);
    });
    
  } catch (error) {
    console.error('❌ News error:', error.response?.data?.message || error.message);
  }
}

async function getSystemInfo() {
  const os = require('os');
  
  console.log('\n💻 SYSTEM INFORMATION:');
  console.log('======================');
  console.log(`🖥️ Platform: ${os.platform()}`);
  console.log(`🏗️ Architecture: ${os.arch()}`);
  console.log(`🔢 CPU Cores: ${os.cpus().length}`);
  console.log(`💾 Total Memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB`);
  console.log(`🆓 Free Memory: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(1)} GB`);
  console.log(`⏰ Uptime: ${Math.floor(os.uptime() / 3600)} hours`);
}

async function main() {
  console.log('🚀 MCP SERVER - CURRENT INFORMATION');
  console.log('====================================');
  
  await getWeatherInfo();
  await getNewsInfo();
  await getSystemInfo();
  
  console.log('\n✅ All information retrieved successfully!');
}

main();
