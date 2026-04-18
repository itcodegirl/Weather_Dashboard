import { useEffect, useState } from 'react';
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
import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = process.env.REACT_APP_WEATHER_BASE_URL;

function App() {
  const [city, setCity] = useState('');
  const [submittedCity, setSubmittedCity] = useState('Chicago');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = city.trim();
    if (!trimmed) return;
    setSubmittedCity(trimmed);
    setCity('');
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError('');

      try {
        const currentResponse = await axios.get(`${BASE_URL}/weather`, {
          params: {
            q: submittedCity,
            appid: API_KEY,
            units: 'imperial',
          },
        });

        const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
          params: {
            q: submittedCity,
            appid: API_KEY,
            units: 'imperial',
          },
        });

        setCurrentWeather(currentResponse.data);

        const dailyForecast = forecastResponse.data.list
          .filter((item) => item.dt_txt.includes('12:00:00'))
          .slice(0, 5);

        setForecast(dailyForecast);
      } catch (err) {
        setError('Could not load weather data. Try another city.');
        setCurrentWeather(null);
        setForecast([]);
      } finally {
        setLoading(false);
      }
    };

    if (API_KEY && BASE_URL) {
      fetchWeather();
    } else {
      setError('Missing weather API configuration.');
      setLoading(false);
    }
  }, [submittedCity]);

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

        {loading && (
          <section className="card">
            <p>Loading weather data...</p>
          </section>
        )}

        {error && !loading && (
          <section className="card">
            <p>{error}</p>
          </section>
        )}

        {!loading && !error && currentWeather && (
          <main className="dashboard-grid">
            <section className="card current-weather">
              <div className="card-top">
                <div>
                  <p className="section-label">Current Conditions</p>
                  <h2>
                    <MapPin size={18} />
                    {currentWeather.name}, {currentWeather.sys.country}
                  </h2>
                </div>

                <div className="weather-badge">
                  <CloudSun size={18} />
                  <span>{currentWeather.weather[0].description}</span>
                </div>
              </div>

              <div className="temperature-row">
                <div className="temperature">
                  {Math.round(currentWeather.main.temp)}°
                </div>
                <div className="temperature-meta">
                  <p>Feels like {Math.round(currentWeather.main.feels_like)}°</p>
                  <p>
                    H: {Math.round(currentWeather.main.temp_max)}° / L:{' '}
                    {Math.round(currentWeather.main.temp_min)}°
                  </p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <Droplets size={18} />
                  <div>
                    <span>Humidity</span>
                    <strong>{currentWeather.main.humidity}%</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <Wind size={18} />
                  <div>
                    <span>Wind</span>
                    <strong>{Math.round(currentWeather.wind.speed)} mph</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <Gauge size={18} />
                  <div>
                    <span>Pressure</span>
                    <strong>{currentWeather.main.pressure} hPa</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <Eye size={18} />
                  <div>
                    <span>Visibility</span>
                    <strong>
                      {(currentWeather.visibility / 1609).toFixed(1)} mi
                    </strong>
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
                {forecast.map((item) => (
                  <article className="forecast-item" key={item.dt}>
                    <div>
                      <h3>
                        {new Date(item.dt_txt).toLocaleDateString('en-US', {
                          weekday: 'short',
                        })}
                      </h3>
                      <p>{item.weather[0].description}</p>
                    </div>

                    <div className="forecast-right">
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                        alt={item.weather[0].description}
                        width="42"
                        height="42"
                      />
                      <strong>{Math.round(item.main.temp)}°</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;