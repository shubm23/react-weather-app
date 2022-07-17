import React, { memo } from "react";
import { useGlobalContext } from "../../context/context";
import moment from "moment";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "./Forecast.css";

const Forecast = memo(() => {
  const { forecastWeather } = useGlobalContext();
  return (
    <>
      {forecastWeather && (
        <>
          <label className="title">
            {moment(forecastWeather?.list.at(0)?.dt_txt).format("Do MMM")} -{" "}
            {moment(forecastWeather?.list.at(-1)?.dt_txt).format("Do MMM")}
          </label>
          <Accordion allowZeroExpanded>
            {forecastWeather.list.map((item, idx) => (
              <AccordionItem key={idx}>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <div className="daily-item">
                      <img
                        src={`icons/${item.weather[0].icon}.png`}
                        className="icon-small"
                        alt="weather"
                      />
                      <label className="day">{moment(item.dt_txt).format("LLLL")}</label>
                      <label className="description">
                        {item.weather[0].description}
                      </label>
                      <label className="min-max">
                        {Math.round(item.main.temp_max)}°C /
                        {Math.round(item.main.temp_min)}°C
                      </label>
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <div className="daily-details-grid">
                    <div className="daily-details-grid-item">
                      <label>Pressure:</label>
                      <label>{item.main.pressure}</label>
                    </div>
                    <div className="daily-details-grid-item">
                      <label>Humidity:</label>
                      <label>{item.main.humidity}</label>
                    </div>
                    <div className="daily-details-grid-item">
                      <label>Clouds:</label>
                      <label>{item.clouds.all}%</label>
                    </div>
                    <div className="daily-details-grid-item">
                      <label>Wind speed:</label>
                      <label>{item.wind.speed} m/s</label>
                    </div>
                    <div className="daily-details-grid-item">
                      <label>Sea level:</label>
                      <label>{item.main.sea_level}m</label>
                    </div>
                    <div className="daily-details-grid-item">
                      <label>Feels like:</label>
                      <label>{item.main.feels_like}°C</label>
                    </div>
                  </div>
                </AccordionItemPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
    </>
  );
});

export default Forecast;
