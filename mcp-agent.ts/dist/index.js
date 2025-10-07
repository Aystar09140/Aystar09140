"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const os = __importStar(require("os"));
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
// Load environment variables
dotenv.config();
// Create MCP server
const server = new index_js_1.Server({
    name: "Aystar's MCP Agent",
    version: "1.0.0",
});
// Get PC system info tool
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_pc_system_info",
                description: "Get basic PC system information",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "get_weather",
                description: "Get current weather information for a city",
                inputSchema: {
                    type: "object",
                    properties: {
                        city: {
                            type: "string",
                            description: "City name to get weather for",
                        },
                    },
                    required: ["city"],
                },
            },
            {
                name: "get_news",
                description: "Get latest news headlines by country, category, or topic",
                inputSchema: {
                    type: "object",
                    properties: {
                        category: {
                            type: "string",
                            description: "News category (optional)",
                        },
                        country: {
                            type: "string",
                            description: "Country code (optional)",
                        },
                        topic: {
                            type: "string",
                            description: "Search topic or keyword (e.g., 'Brazil economy', 'AI technology', 'climate change')",
                        },
                    },
                },
            },
            {
                name: "zapier_webhook",
                description: "Trigger a Zapier webhook with data",
                inputSchema: {
                    type: "object",
                    properties: {
                        data: {
                            type: "object",
                            description: "Data to send to Zapier webhook",
                        },
                    },
                    required: ["data"],
                },
            },
        ],
    };
});
// Handle tool calls
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "get_pc_system_info":
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                platform: os.platform(),
                                arch: os.arch(),
                                cpuCount: os.cpus().length,
                                totalMemory: os.totalmem(),
                                freeMemory: os.freemem(),
                                uptime: os.uptime(),
                            }, null, 2),
                        },
                    ],
                };
            case "get_weather":
                const city = args?.city;
                if (!city) {
                    throw new Error("City parameter is required");
                }
                const weatherApiKey = process.env.OPENWEATHER_API_KEY;
                if (!weatherApiKey) {
                    throw new Error("OpenWeather API key not configured");
                }
                const weatherResponse = await axios_1.default.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(weatherResponse.data, null, 2),
                        },
                    ],
                };
            case "get_news":
                const newsApiKey = process.env.NEWS_API_KEY;
                if (!newsApiKey) {
                    throw new Error("News API key not configured");
                }
                const topic = args?.topic;
                if (topic) {
                    // Search by topic using everything endpoint
                    const searchResponse = await axios_1.default.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&apiKey=${newsApiKey}&pageSize=10`);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(searchResponse.data, null, 2),
                            },
                        ],
                    };
                }
                else {
                    // Use headlines endpoint for country/category
                    const category = args?.category || "general";
                    const country = args?.country || "us";
                    const newsResponse = await axios_1.default.get(`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${newsApiKey}`);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(newsResponse.data, null, 2),
                            },
                        ],
                    };
                }
            case "zapier_webhook":
                const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;
                if (!webhookUrl) {
                    throw new Error("Zapier webhook URL not configured");
                }
                const data = args?.data;
                if (!data) {
                    throw new Error("Data parameter is required");
                }
                const zapierResponse = await axios_1.default.post(webhookUrl, data);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                status: "success",
                                response: zapierResponse.data,
                            }, null, 2),
                        },
                    ],
                };
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        throw new Error(`Tool execution failed: ${error.message}`);
    }
});
// Start the server
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Agent started successfully");
}
main().catch((error) => {
    console.error("Failed to start MCP Agent:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map