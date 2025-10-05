import { FastMCP } from "fastmcp";
import { z } from "zod";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import axios from "axios";
import * as os from "os";
require("dotenv").config();

const execFileAsync = promisify(execFile);

const server = new FastMCP({
  name: "Aystar's MCP Agent",
  version: "1.0.0",
});

// Example tool implementation
server.tool({
  name: "check_inbox",
  description: "Check email inbox for new messages",
  inputSchema: z.object({
    folder: z.string().optional().default("INBOX"),
    limit: z.number().optional().default(10),
  }),
  handler: async ({ input }) => {
    try {
      // Placeholder implementation
      return {
        messages: [],
        count: 0,
        folder: input.folder,
      };
    } catch (error) {
      throw new Error(`Failed to check inbox: ${error}`);
    }
  },
});

// Example of another tool
server.tool({
  name: "send_email",
  description: "Send an email message",
  inputSchema: z.object({
    to: z.string().email(),
    subject: z.string(),
    body: z.string(),
  }),
  handler: async ({ input }) => {
    try {
      // Placeholder implementation
      return {
        success: true,
        messageId: "msg_" + Date.now(),
        sentAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to send email: ${error}`);
    }
  },
});

// Lighthouse-based performance audit tool
server.tool({
  name: "lighthouse_audit",
  description: "Run a Lighthouse audit and return the JSON report (defaults to performance)",
  inputSchema: z.object({
    url: z.string().url(),
    categories: z
      .array(z.enum(["performance", "accessibility", "best-practices", "seo", "pwa"]))
      .optional()
      .default(["performance"]),
    headless: z.boolean().optional().default(true),
  }),
  handler: async ({ input }) => {
    const categoriesArg = `--only-categories=${input.categories.join(",")}`;
    const chromeFlags = input.headless ? "--headless=new" : "";
    const args = [
      "-y",
      "lighthouse",
      input.url,
      "--quiet",
      `--chrome-flags=${chromeFlags}`,
      categoriesArg,
      "--output=json",
      "--output-path=stdout",
    ];

    try {
      const { stdout } = await execFileAsync("npx", args, { maxBuffer: 20 * 1024 * 1024 });
      const report = JSON.parse(stdout);
      return { report };
    } catch (error: any) {
      throw new Error(`Lighthouse audit failed: ${error?.stderr || error?.message || String(error)}`);
    }
  },
});

// Get weather info
server.tool({
  name: "get_weather",
  description: "Get current weather information for a location",
  inputSchema: z.object({
    location: z.string(),
  }),
  handler: async ({ input }) => {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) throw new Error("OpenWeather API key not set");
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(input.location)}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get weather: ${error.message}`);
    }
  },
});

// Get calendar events (placeholder - requires OAuth setup for full Google Calendar access)
server.tool({
  name: "get_calendar_events",
  description: "Get upcoming calendar events (placeholder implementation)",
  inputSchema: z.object({
    calendarId: z.string().optional().default("primary"),
    maxResults: z.number().optional().default(10),
  }),
  handler: async ({ input }) => {
    // Placeholder: In a real implementation, set up Google Calendar API with OAuth
    return {
      events: [],
      message: "Calendar integration requires OAuth setup. This is a placeholder.",
    };
  },
});

// Send notification via Zapier
server.tool({
  name: "send_notification",
  description: "Send a notification message via Zapier webhook",
  inputSchema: z.object({
    message: z.string(),
  }),
  handler: async ({ input }) => {
    try {
      const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;
      if (!webhookUrl) throw new Error("Zapier webhook URL not set");
      await axios.post(webhookUrl, { message: input.message });
      return { success: true, sentAt: new Date().toISOString() };
    } catch (error: any) {
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  },
});

// Get PC system info
server.tool({
  name: "get_pc_system_info",
  description: "Get basic PC system information",
  inputSchema: z.object({}),
  handler: async () => {
    return {
      platform: os.platform(),
      arch: os.arch(),
      cpuCount: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      uptime: os.uptime(),
    };
  },
});

// Improved send_email tool with Zapier option
server.tool({
  name: "send_email",
  description: "Send an email message (placeholder or via Zapier)",
  inputSchema: z.object({
    to: z.string().email(),
    subject: z.string(),
    body: z.string(),
    useZapier: z.boolean().optional().default(false),
  }),
  handler: async ({ input }) => {
    try {
      if (input.useZapier) {
        const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;
        if (!webhookUrl) throw new Error("Zapier webhook URL not set for email");
        await axios.post(webhookUrl, {
          type: "email",
          to: input.to,
          subject: input.subject,
          body: input.body,
        });
        return {
          success: true,
          method: "zapier",
          messageId: "zap_" + Date.now(),
          sentAt: new Date().toISOString(),
        };
      } else {
        // Placeholder implementation
        return {
          success: true,
          method: "placeholder",
          messageId: "msg_" + Date.now(),
          sentAt: new Date().toISOString(),
        };
      }
    } catch (error: any) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  },
});

// Error handling for server startup
try {
  server.start({
    transportType: "stdio",
  });
  console.error("MCP Agent started successfully");
} catch (error) {
  console.error("Failed to start MCP Agent:", error);
  process.exit(1);
}
