import "./App.css";
import { useGlobalContext } from "./context/context";
import Search from "./components/search/Search";
import CurrentWeather from "./components/current-weather/CurrentWeather";
import Forecast from "./components/forecast/Forecast";
import Error from "./components/error/Error";

function App() {
  const { error } = useGlobalContext();
  return (
    <div className="container">
      {error ? (
        <Error />
      ) : (
        <>
          <Search />
          <CurrentWeather />
          <Forecast />
        </>
      )}
    </div>
  );
}

export default App;
