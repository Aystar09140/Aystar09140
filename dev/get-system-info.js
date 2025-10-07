const os = require('os');

// Get system information using the same logic as your MCP agent
const systemInfo = {
  platform: os.platform(),
  arch: os.arch(),
  cpuCount: os.cpus().length,
  totalMemory: os.totalmem(),
  freeMemory: os.freemem(),
  uptime: os.uptime(),
  hostname: os.hostname(),
  userInfo: os.userInfo(),
  networkInterfaces: os.networkInterfaces()
};

console.log('=== System Information ===');
console.log(JSON.stringify(systemInfo, null, 2));

// Additional formatted output
console.log('\n=== Formatted System Info ===');
console.log(`Platform: ${systemInfo.platform}`);
console.log(`Architecture: ${systemInfo.arch}`);
console.log(`CPU Cores: ${systemInfo.cpuCount}`);
console.log(`Total Memory: ${(systemInfo.totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`);
console.log(`Free Memory: ${(systemInfo.freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB`);
console.log(`Uptime: ${Math.floor(systemInfo.uptime / 3600)} hours, ${Math.floor((systemInfo.uptime % 3600) / 60)} minutes`);
console.log(`Hostname: ${systemInfo.hostname}`);
console.log(`User: ${systemInfo.userInfo.username}`);

