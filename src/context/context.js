import React, { useState, useContext, useCallback } from "react";
import { GEO_API, WEATHER_API } from "../api/api";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [search, setSearch] = useState(null);
  const [currentWeather, setcurrentWeather] = useState(null);
  const [forecastWeather, setforecastWeather] = useState(null);
  const [error, setError] = useState(false);

  const handleonSearchChange = useCallback(
    (searchData) => {
      const [lat, lon] = searchData.value.split(" ");
      const { ONECALL_URL, FORECAST_URL } = WEATHER_API;

      const currentWeather = fetch(ONECALL_URL(lat, lon));
      const forecastWeather = fetch(FORECAST_URL(lat, lon));

      Promise.all([currentWeather, forecastWeather])
        .then(async (res) => {
          const weatherResponse = await res[0].json();
          const forecastResponse = await res[1].json();
          setcurrentWeather({ city: searchData.label, ...weatherResponse });
          setforecastWeather({ city: searchData.label, ...forecastResponse });
        })
        .catch((err) => setError(true));
    },
    [currentWeather, forecastWeather]
  );

  const loadOptions = useCallback(
    (inputValue) => {
      const { GEO_API_URL, GEO_API_OPTIONS } = GEO_API;
      return fetch(
        `${GEO_API_URL}/cities?minPopulation=1000000&namePrefix=${inputValue}`,
        GEO_API_OPTIONS
      )
        .then((res) => res.json())
        .then((data) => {
          return {
            options: data.data.map((city) => {
              const { name, countryCode, latitude, longitude } = city;
              return {
                value: `${latitude} ${longitude}`,
                label: `${name} , ${countryCode}`,
              };
            }),
          };
        })
        .catch((err) => setError(true));
    },
    [search]
  );

  const handleOnChange = useCallback(
    (searchData) => {
      setSearch(searchData);
      handleonSearchChange(searchData);
    },
    [search]
  );

  return (
    <AppContext.Provider
      value={{
        search,
        currentWeather,
        forecastWeather,
        error,
        loadOptions,
        handleOnChange,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
