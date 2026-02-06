import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

interface ForecastEntry {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

interface DayForecast {
  date: string;
  dayName: string;
  tempHigh: number;
  tempLow: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
    return NextResponse.json(
      { error: "Invalid latitude or longitude" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey || apiKey === "your-openweathermap-api-key-here") {
    return NextResponse.json(
      { error: "Weather API key is not configured. Set OPENWEATHERMAP_API_KEY in .env.local" },
      { status: 500 }
    );
  }

  // Fetch both current weather and 5-day forecast in parallel
  const [currentRes, forecastRes] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latNum}&lon=${lonNum}&appid=${apiKey}&units=imperial`),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latNum}&lon=${lonNum}&appid=${apiKey}&units=imperial`),
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    const failedRes = !currentRes.ok ? currentRes : forecastRes;
    if (failedRes.status === 401) {
      return NextResponse.json(
        { error: "Weather API key is invalid or not yet activated. New keys can take up to 2 hours to activate." },
        { status: 502 }
      );
    }
    const errData = await failedRes.json().catch(() => null);
    return NextResponse.json(
      { error: errData?.message || "Failed to fetch weather data from provider" },
      { status: 502 }
    );
  }

  const current = await currentRes.json();
  const forecast = await forecastRes.json();

  // Aggregate 3-hour entries into daily forecasts
  const dailyMap = new Map<string, ForecastEntry[]>();
  for (const entry of forecast.list as ForecastEntry[]) {
    const date = new Date(entry.dt * 1000).toISOString().split("T")[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(entry);
  }

  const days: DayForecast[] = [];
  for (const [date, entries] of dailyMap) {
    const temps = entries.map((e) => e.main.temp);
    const highs = entries.map((e) => e.main.temp_max);
    const lows = entries.map((e) => e.main.temp_min);
    // Pick the midday entry (or closest) for description/icon
    const midday = entries.reduce((closest, e) => {
      const hour = new Date(e.dt * 1000).getHours();
      const closestHour = new Date(closest.dt * 1000).getHours();
      return Math.abs(hour - 14) < Math.abs(closestHour - 14) ? e : closest;
    });

    const d = new Date(date + "T12:00:00");
    days.push({
      date,
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      tempHigh: Math.max(...highs),
      tempLow: Math.min(...lows),
      description: midday.weather[0].description,
      icon: midday.weather[0].icon,
      humidity: Math.round(entries.reduce((s, e) => s + e.main.humidity, 0) / entries.length),
      windSpeed: Math.round(entries.reduce((s, e) => s + e.wind.speed, 0) / entries.length),
    });
  }

  return NextResponse.json({
    location: current.name,
    current: {
      temperature: current.main.temp,
      feelsLike: current.main.feels_like,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      humidity: current.main.humidity,
      windSpeed: current.wind.speed,
    },
    forecast: days.slice(0, 5),
  });
}
