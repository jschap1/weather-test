# Weather Dashboard

A personal weather dashboard built with Next.js. Shows current conditions and a 5-day forecast based on your location using the OpenWeatherMap API.

## Features

- User registration and login (NextAuth.js with credentials)
- Current weather and 5-day forecast via OpenWeatherMap
- Geolocation-based weather lookup
- User profiles with profile image support
- PostgreSQL database via Prisma

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Auth:** NextAuth.js v5
- **Database:** PostgreSQL with Prisma ORM
- **Weather API:** OpenWeatherMap
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. [Neon](https://neon.tech) or [Supabase](https://supabase.com) — both have free tiers)
- An [OpenWeatherMap API key](https://openweathermap.org/api) (free tier works)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example env file and fill in your values:

   ```bash
   cp .env.local.example .env.local
   ```

   Set `NEXTAUTH_SECRET` to a random string, add your `OPENWEATHERMAP_API_KEY`, and set `DATABASE_URL` to your PostgreSQL connection string.

3. Initialize the database:

   ```bash
   npx prisma db push
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.
