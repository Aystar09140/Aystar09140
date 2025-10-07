const axios = require('axios');
require('dotenv').config();

async function testNews() {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const country = 'us'; // United States
    const category = 'general';
    
    console.log(`📰 Getting news for: ${country.toUpperCase()}`);
    console.log(`Using API key: ${apiKey.substring(0, 8)}...`);
    
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`
    );
    
    const data = response.data;
    console.log('\n📰 LATEST NEWS:');
    console.log('===============');
    console.log(`📊 Total articles: ${data.totalResults}`);
    console.log(`📅 Status: ${data.status}`);
    console.log('\n📋 TOP HEADLINES:');
    console.log('================');
    
    data.articles.slice(0, 5).forEach((article, index) => {
      console.log(`\n${index + 1}. ${article.title}`);
      console.log(`   📰 Source: ${article.source.name}`);
      console.log(`   📅 Published: ${new Date(article.publishedAt).toLocaleString()}`);
      if (article.description) {
        console.log(`   📝 ${article.description.substring(0, 100)}...`);
      }
      console.log(`   🔗 ${article.url}`);
    });
    
  } catch (error) {
    console.error('❌ Error getting news:', error.response?.data?.message || error.message);
  }
}

testNews();
