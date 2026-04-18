import { useMemo, useState } from 'react';
import './App.css';
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Sun,
  CloudSun,
} from 'lucide-react';

const mockCurrentWeather = {
  city: 'Chicago',
  country: 'US',
  temperature: 68,
  feelsLike: 66,
  description: 'Partly cloudy',
  humidity: 58,
  windSpeed: 12,
  pressure: 1015,
  visibility: 10,
  high: 72,
  low: 61,
};

const mockForecast = [
  { day: 'Mon', temp: 69, icon: '☀️', condition: 'Sunny' },
  { day: 'Tue', temp: 66, icon: '⛅', condition: 'Clouds' },
  { day: 'Wed', temp: 64, icon: '🌦️', condition: 'Showers' },
  { day: 'Thu', temp: 71, icon: '☀️', condition: 'Clear' },
  { day: 'Fri', temp: 67, icon: '🌤️', condition: 'Fair' },
];

function App() {
  const [city, setCity] = useState('');
  const [submittedCity, setSubmittedCity] = useState('Chicago');

  const currentWeather = useMemo(() => {
    return {
      ...mockCurrentWeather,
      city: submittedCity || 'Chicago',
    };
  }, [submittedCity]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = city.trim();
    if (!trimmed) return;
    setSubmittedCity(trimmed);
    setCity('');
  };

  return (
    <div className="app-shell">
      <div className="weather-app">
        <header className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Weather Dashboard</p>
            <h1>Forecasts with a cleaner signal.</h1>
            <p className="hero-text">
              Search a city, view current conditions, and scan the weekly outlook
              in one polished dashboard.
            </p>
          </div>

          <form className="search-bar" onSubmit={handleSubmit}>
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                aria-label="Search city"
              />
            </div>
            <button type="submit">Search</button>
          </form>
        </header>

        <main className="dashboard-grid">
          <section className="card current-weather">
            <div className="card-top">
              <div>
                <p className="section-label">Current Conditions</p>
                <h2>
                  <MapPin size={18} />
                  {currentWeather.city}, {currentWeather.country}
                </h2>
              </div>
              <div className="weather-badge">
                <CloudSun size={18} />
                <span>{currentWeather.description}</span>
              </div>
            </div>

            <div className="temperature-row">
              <div className="temperature">{currentWeather.temperature}°</div>
              <div className="temperature-meta">
                <p>Feels like {currentWeather.feelsLike}°</p>
                <p>
                  H: {currentWeather.high}° / L: {currentWeather.low}°
                </p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <Droplets size={18} />
                <div>
                  <span>Humidity</span>
                  <strong>{currentWeather.humidity}%</strong>
                </div>
              </div>

              <div className="stat-card">
                <Wind size={18} />
                <div>
                  <span>Wind</span>
                  <strong>{currentWeather.windSpeed} mph</strong>
                </div>
              </div>

              <div className="stat-card">
                <Gauge size={18} />
                <div>
                  <span>Pressure</span>
                  <strong>{currentWeather.pressure} hPa</strong>
                </div>
              </div>

              <div className="stat-card">
                <Eye size={18} />
                <div>
                  <span>Visibility</span>
                  <strong>{currentWeather.visibility} mi</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="card forecast-card">
            <div className="card-header">
              <p className="section-label">5-Day Forecast</p>
              <Sun size={18} />
            </div>

            <div className="forecast-list">
              {mockForecast.map((item) => (
                <article className="forecast-item" key={item.day}>
                  <div>
                    <h3>{item.day}</h3>
                    <p>{item.condition}</p>
                  </div>
                  <div className="forecast-right">
                    <span className="forecast-icon">{item.icon}</span>
                    <strong>{item.temp}°</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;