import React, { useState, useEffect } from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
} from "lucide-react";

const WeatherModule = ({ LocationDetail }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async ({ LocationDetail }) => {
      try {
        setLoading(true);
        const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            LocationDetail?.Name
          )}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error("Weather data fetch failed");
        }

        const data = await response.json();
        // console.log(data);
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (LocationDetail?.Name) {
      fetchWeather();
    }
  }, [LocationDetail?.Name]);

  const getWeatherIcon = (weatherCode) => {
    if (!weatherCode) return <Sun className="w-8 h-8" />;

    const code = weatherCode.toString();
    switch (true) {
      case code.startsWith("2"): // Thunderstorm
        return <CloudLightning className="w-8 h-8" />;
      case code.startsWith("3"): // Drizzle
      case code.startsWith("5"): // Rain
        return <CloudRain className="w-8 h-8" />;
      case code.startsWith("6"): // Snow
        return <CloudSnow className="w-8 h-8" />;
      case code.startsWith("7"): // Atmosphere (mist, fog, etc)
        return <Wind className="w-8 h-8" />;
      case code === "800": // Clear
        return <Sun className="w-8 h-8" />;
      default: // Clouds
        return <Cloud className="w-8 h-8" />;
    }
  };

  if (loading) {
    return (
      <div className="w-[300px] bg-white rounded-lg shadow-md">
        <div className="p-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[300px] bg-red-50 rounded-lg shadow-md">
        <div className="p-4">
          <p className="text-red-500">
            Unable to load weather data for {LocationDetail?.Name}
          </p>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="w-[300px] bg-white rounded-lg shadow-md">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{LocationDetail?.Name}</h3>
          {getWeatherIcon(weatherData.weather[0]?.id)}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">
              {Math.round(weatherData.main.temp)}°C
            </span>
            <span className="text-gray-500 capitalize">
              {weatherData.weather[0]?.description}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-blue-50 p-2 rounded">
              <span className="text-blue-700">High: </span>
              {Math.round(weatherData.main.temp_max)}°C
            </div>
            <div className="bg-orange-50 p-2 rounded">
              <span className="text-orange-700">Low: </span>
              {Math.round(weatherData.main.temp_min)}°C
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-700">Humidity: </span>
              {weatherData.main.humidity}%
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-700">Wind: </span>
              {Math.round(weatherData.wind.speed)} m/s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherModule;
