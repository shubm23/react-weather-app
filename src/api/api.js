export const GEO_API = {
  GEO_API_URL: "https://wft-geo-db.p.rapidapi.com/v1/geo",
  GEO_API_OPTIONS: {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "35e908026amsh636f734fd63e308p1bd1cajsn49ecd9bd2b0e",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  },
};

export const WEATHER_API = {
  HOST_URL: `https://api.openweathermap.org/data/2.5`,
  KEY: "c1f52cf68e21907fafad92a5126f08d5",
  ONECALL_URL: function (lat, lon) {
    return `${WEATHER_API.HOST_URL}/onecall?lat=${lat}&lon=${lon}&appid=${WEATHER_API.KEY}&units=metric`;
  },
  FORECAST_URL: function (lat, lon) {
    return `${WEATHER_API.HOST_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API.KEY}&units=metric`;
  },
};
