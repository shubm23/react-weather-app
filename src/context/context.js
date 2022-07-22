import React, { useCallback, useContext, useEffect, useReducer } from "react";
import { GEO_API, WEATHER_API } from "../api/api";
import { isFunction } from "lodash";

const AppContext = React.createContext();

const INTIAL_FETCH = "INTIAL_FETCH";
const LOADING = "LOADING";
const SEARCH_FETCH = "SEARCH_FETCH";
const ERROR = "ERROR";

const intialState = {
  intial: false,
  search: null,
  loading: false,
  currentWeather: null,
  forecastWeather: null,
};

const fetchReducer = (state, action) => {
  if (action.type === LOADING) {
    return { ...state, loading: true };
  } else if (action.type === INTIAL_FETCH) {
    return {
      ...state,
      intial: true,
      loading: false,
    };
  } else if (action.type === SEARCH_FETCH) {
    const { search, currentWeather, forecastWeather } = action.payload;
    return {
      intial: false,
      loading: false,
      search,
      currentWeather,
      forecastWeather,
    };
  } else if (action.type === ERROR) {
    return {
      ...state,
      loading: false,
    };
  }
  return state;
};

const useThunkReducer = (reducer, intial) => {
  const [state, dispatch] = useReducer(reducer, intial);
  const enhancedReducer = useCallback(
    (action) => {
      if (isFunction(action)) {
        action(dispatch);
      } else {
        dispatch(action);
      }
    },
    [dispatch]
  );
  return [state, enhancedReducer];
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useThunkReducer(fetchReducer, intialState);

  const fetchForecastCurrent = async (lat, lon) => {
    const { ONECALL_URL, FORECAST_URL } = WEATHER_API;
    const currentWeather = fetch(ONECALL_URL(lat, lon));
    const forecastWeather = fetch(FORECAST_URL(lat, lon));
    try {
      const res = await Promise.all([currentWeather, forecastWeather]);
      const weatherResponse = await res[0].json();
      const forecastResponse = await res[1].json();
      return {
        currentWeather: {
          city: `${forecastResponse.city.name} , ${forecastResponse.city.country}`,
          ...weatherResponse,
        },
        forecastWeather: {
          city: `${forecastResponse.city.name} , ${forecastResponse.city.country}`,
          ...forecastResponse,
        },
      };
    } catch (err) {
      return { error: err };
    }
  };

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      });
    });
  };

  const currentPosition = () => {
    dispatch({ type: `${LOADING}` });
    getPosition()
      .then((position) => {
        fetchForecastCurrent(
          position.coords.latitude,
          position.coords.longitude
        )
          .then(({ currentWeather, forecastWeather }) => {
            dispatch({
              type: `${SEARCH_FETCH}`,
              payload: {
                search: `${position.coords.latitude} ${position.coords.longitude}`,
                currentWeather,
                forecastWeather,
              },
            });
          })
          .catch((err) => {
            dispatch({ type: `${ERROR}` });
          });
      })
      .catch((err) => {
        dispatch({ type: `${ERROR}` });
      });
  };

  const handleonSearchChange = (searchData) => {
    dispatch({ type: `${LOADING}` });
    const [lat, lon] = searchData.value.split(" ");
    fetchForecastCurrent(lat, lon)
      .then((data) => {
        const { currentWeather, forecastWeather } = data;
        dispatch({
          type: `${SEARCH_FETCH}`,
          payload: {
            search: searchData,
            currentWeather,
            forecastWeather,
          },
        });
      })
      .catch((err) => {
        dispatch({ type: `${ERROR}` });
      });
  };

  const loadOptions = (inputValue = "") => {
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
    handleonSearchChange(searchData);
  };

  useEffect(() => {
    dispatch({ type: `${INTIAL_FETCH}` });
  }, []);

  useEffect(() => {
    currentPosition();
  }, [state.intial]);

  return (
    <AppContext.Provider
      value={{
        search: state.search,
        loading: state.loading,
        currentWeather: state.currentWeather,
        forecastWeather: state.forecastWeather,
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
