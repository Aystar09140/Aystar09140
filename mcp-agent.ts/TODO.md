# TODO: Build MCP Server with Zapier Integration for Daily Tasks

## Steps to Complete

- [x] Update `package.json` to add dependencies: `axios` for HTTP requests, `googleapis` for Google Calendar, `dotenv` for environment variables.
- [x] Create `.env` file with placeholders for API keys: OPENWEATHER_API_KEY, GOOGLE_CALENDAR_API_KEY, ZAPIER_WEBHOOK_URL.
- [x] Update `src/index.ts` to:
  - Import necessary modules (axios, googleapis, os, dotenv).
  - Load environment variables.
  - Add `get_weather` tool using OpenWeatherMap API.
  - Add `get_calendar_events` tool using Google Calendar API.
  - Add `send_notification` tool to trigger Zapier webhook.
  - Add `get_pc_system_info` tool using Node.js os module.
  - Improve `send_email` tool to optionally use Zapier.
- [x] Install dependencies with `npm install`.
- [x] Test the server locally with `npm run dev`.
- [ ] Configure Zapier webhooks for notifications/emails.
