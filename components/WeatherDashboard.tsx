"use client";

import { useState, useEffect } from "react";

interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
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

interface WeatherData {
  location: string;
  current: CurrentWeather;
  forecast: DayForecast[];
}

export default function WeatherDashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `/api/weather?lat=${latitude}&lon=${longitude}`
          );
          if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Failed to fetch weather data");
            setLoading(false);
            return;
          }
          const data = await res.json();
          setWeather(data);
        } catch {
          setError("Failed to fetch weather data");
        }
        setLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              "Location access denied. Please allow location access to see weather."
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("The request to get your location timed out.");
            break;
          default:
            setError("An unknown error occurred getting your location.");
        }
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  if (loading) {
    return (
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: "var(--radius)",
          padding: "2rem",
          boxShadow: "var(--shadow)",
          textAlign: "center",
          color: "var(--text-muted)",
        }}
      >
        Loading weather data...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "#fef2f2",
          borderRadius: "var(--radius)",
          padding: "1.5rem",
          border: "1px solid #fecaca",
          color: "var(--danger)",
        }}
      >
        {error}
      </div>
    );
  }

  if (!weather) return null;

  const { current, forecast, location } = weather;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Current weather */}
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: "var(--radius)",
          padding: "2rem",
          boxShadow: "var(--shadow)",
        }}
      >
        <div style={{ fontSize: "1.1rem", fontWeight: 500, marginBottom: "1rem" }}>
          {location}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <img
            src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
            alt={current.description}
            width={80}
            height={80}
          />
          <div>
            <div style={{ fontSize: "2.5rem", fontWeight: 700 }}>
              {Math.round(current.temperature)}&deg;F
            </div>
            <div
              style={{
                color: "var(--text-muted)",
                textTransform: "capitalize",
              }}
            >
              {current.description}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
          }}
        >
          <div
            style={{
              padding: "0.75rem",
              background: "var(--bg)",
              borderRadius: "var(--radius)",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Feels Like
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
              {Math.round(current.feelsLike)}&deg;F
            </div>
          </div>
          <div
            style={{
              padding: "0.75rem",
              background: "var(--bg)",
              borderRadius: "var(--radius)",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Humidity
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
              {current.humidity}%
            </div>
          </div>
          <div
            style={{
              padding: "0.75rem",
              background: "var(--bg)",
              borderRadius: "var(--radius)",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Wind
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
              {Math.round(current.windSpeed)} mph
            </div>
          </div>
        </div>
      </div>

      {/* 5-day forecast */}
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: "var(--radius)",
          padding: "2rem",
          boxShadow: "var(--shadow)",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>
          5-Day Forecast
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {forecast.map((day) => (
            <div
              key={day.date}
              style={{
                padding: "1rem 0.75rem",
                background: "var(--bg)",
                borderRadius: "var(--radius)",
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                {day.dayName}
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt={day.description}
                width={50}
                height={50}
              />
              <div style={{ fontSize: "0.85rem", textTransform: "capitalize", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                {day.description}
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 600 }}>
                {Math.round(day.tempHigh)}&deg;
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {Math.round(day.tempLow)}&deg;
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OpenWeatherMap attribution */}
      <div
        style={{
          textAlign: "center",
          padding: "0.75rem",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
        }}
      >
        Weather data provided by{" "}
        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--primary)" }}
        >
          OpenWeather
        </a>
      </div>
    </div>
  );
}
