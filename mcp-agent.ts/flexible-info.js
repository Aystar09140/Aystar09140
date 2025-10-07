const axios = require('axios');
require('dotenv').config();

async function getWeatherForCity(city, country = '') {
  try {
    const location = country ? `${city}, ${country}` : city;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    console.log(`🌤️ Getting weather for: ${location}`);
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
    
    const data = response.data;
    console.log(`\n🌤️ WEATHER IN ${data.name.toUpperCase()}:`);
    console.log('='.repeat(30));
    console.log(`📍 ${data.name}, ${data.sys.country}`);
    console.log(`🌡️ Temperature: ${data.main.temp}°C`);
    console.log(`🌡️ Feels like: ${data.main.feels_like}°C`);
    console.log(`☁️ Weather: ${data.weather[0].description}`);
    console.log(`💧 Humidity: ${data.main.humidity}%`);
    console.log(`💨 Wind: ${data.wind.speed} m/s`);
    console.log(`👁️ Visibility: ${data.visibility ? (data.visibility/1000).toFixed(1) + ' km' : 'N/A'}`);
    console.log(`🌅 Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`);
    console.log(`🌇 Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`);
    
  } catch (error) {
    console.error('❌ Weather error:', error.response?.data?.message || error.message);
  }
}

async function getNewsForCountry(countryCode = 'us') {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    console.log(`\n📰 Getting news for: ${countryCode.toUpperCase()}`);
    
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=${countryCode}&category=general&apiKey=${apiKey}`
    );
    
    const data = response.data;
    console.log(`\n📰 NEWS IN ${countryCode.toUpperCase()}:`);
    console.log('='.repeat(25));
    console.log(`📊 Total articles: ${data.totalResults}`);
    
    if (data.articles && data.articles.length > 0) {
      data.articles.slice(0, 3).forEach((article, index) => {
        console.log(`\n${index + 1}. ${article.title}`);
        console.log(`   📰 ${article.source.name} | ${new Date(article.publishedAt).toLocaleString()}`);
      });
    } else {
      console.log('No articles found. Trying international news...');
      await getNewsForCountry('us'); // Fallback to US news
    }
    
  } catch (error) {
    console.error('❌ News error:', error.response?.data?.message || error.message);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const city = args[0] || 'Lagos';
const country = args[1] || 'Nigeria';
const newsCountry = args[2] || 'ng';

async function main() {
  console.log(`🌍 GETTING INFORMATION FOR: ${city.toUpperCase()}, ${country.toUpperCase()}`);
  console.log('='.repeat(60));
  
  await getWeatherForCity(city, country);
  await getNewsForCountry(newsCountry);
  
  console.log('\n✅ Information retrieved successfully!');
  console.log('\n💡 Usage: node flexible-info.js [city] [country] [news_country_code]');
  console.log('   Examples:');
  console.log('   node flexible-info.js Lagos Nigeria ng');
  console.log('   node flexible-info.js London UK gb');
  console.log('   node flexible-info.js New York USA us');
}

main();
