import React, { useState, useContext, useEffect } from "react";
import { GEO_API, WEATHER_API } from "../api/api";

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [search, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currLatLong, setcurrLatLong] = useState("");
  const [currentWeather, setcurrentWeather] = useState(null);
  const [forecastWeather, setforecastWeather] = useState(null);

  const currentPosition = async () => {
    setLoading(true);
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        setcurrLatLong(
          `${position.coords.latitude} ${position.coords.longitude}`
        );
        setLoading(false);
      },
      (err) => {
        console.log(err);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const handleonSearchChange = (searchData) => {
    setLoading(true);
    const [lat, lon] = searchData.value.split(" ");
    const { ONECALL_URL, FORECAST_URL } = WEATHER_API;

    const currentWeather = fetch(ONECALL_URL(lat, lon));
    const forecastWeather = fetch(FORECAST_URL(lat, lon));

    Promise.all([currentWeather, forecastWeather])
      .then(async (res) => {
        const weatherResponse = await res[0].json();
        const forecastResponse = await res[1].json();
        setcurrentWeather({
          city: searchData.label
            ? searchData.label
            : `${forecastResponse.city.name} , ${forecastResponse.city.country}`,
          ...weatherResponse,
        });
        setforecastWeather({
          city: searchData.label
            ? searchData.label
            : `${forecastResponse.city.name} , ${forecastResponse.city.country}`,
          ...forecastResponse,
        });
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const loadOptions = (inputValue) => {
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
      .catch((err) => console.log(err));
  };

  const handleOnChange = (searchData) => {
    setSearch(searchData);
    handleonSearchChange(searchData);
  };

  useEffect(() => {
    currentPosition();
  }, []);

  useEffect(() => {
    {
      currLatLong.trim().length > 0 &&
        handleonSearchChange({
          value: currLatLong,
        });
    }
  }, [currLatLong]);

  return (
    <AppContext.Provider
      value={{
        search,
        loading,
        currentWeather,
        forecastWeather,
        loadOptions,
        handleOnChange,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
