import React,{memo} from "react";
import { useGlobalContext } from "../../context/context";
import "./CurrentWeather.css";

const CurrentWeather = memo(() => {
  const { currentWeather } = useGlobalContext();
  return (
    <>
      {currentWeather && (
        <>
          <div className="weather">
            <div className="top">
              <div>
                <p className="city">{currentWeather.city}</p>
                <p className="weather-desc">{currentWeather.current.weather[0].description}</p>
              </div>
              <img
                src={`icons/${currentWeather.current.weather[0].icon}.png`}
                alt="weather"
                className="weather-icon"
              />
            </div>
            <div className="bottom">
              <p className="temperature">{Math.round(currentWeather.current.temp)}°C</p>
              <div className="details">
                <div className="parameter-row">
                  <span className="parameter-label">Details</span>
                </div>
                <div className="parameter-row">
                  <span className="parameter-label">Feels Like</span>
                  <span className="parameter-value">
                    {Math.round(currentWeather.current.feels_like)}°C
                  </span>
                </div>
                <div className="parameter-row">
                  <span className="parameter-label">Wind</span>
                  <span className="parameter-value">
                    {currentWeather.current.wind_speed} m/s
                  </span>
                </div>
                <div className="parameter-row">
                  <span className="parameter-label">Humidity</span>
                  <span className="parameter-value">{currentWeather.current.humidity} %</span>
                </div>
                <div className="parameter-row">
                  <span className="parameter-label">Pressure</span>
                  <span className="parameter-value">{currentWeather.current.pressure} Pa</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
});

export default CurrentWeather;
