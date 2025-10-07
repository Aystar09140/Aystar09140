const axios = require('axios');
require('dotenv').config();

async function testZapier() {
  try {
    const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;
    
    console.log(`🔗 Testing Zapier webhook: ${webhookUrl}`);
    
    const testData = {
      message: "Hello from MCP Server!",
      timestamp: new Date().toISOString(),
      source: "MCP Agent",
      test: true,
      weather: "Sunny",
      news: "Tech news update"
    };
    
    console.log('\n📤 Sending test data to Zapier:');
    console.log(JSON.stringify(testData, null, 2));
    
    const response = await axios.post(webhookUrl, testData);
    
    console.log('\n✅ Zapier webhook response:');
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(response.data, null, 2)}`);
    
  } catch (error) {
    console.error('❌ Error testing Zapier webhook:', error.response?.data || error.message);
  }
}

testZapier();
