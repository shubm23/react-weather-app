import "./App.css";
import { useGlobalContext } from "./context/context";
import { ThreeDots } from "react-loader-spinner";
import { Search, CurrentWeather, Forecast } from "./components/index";

function App() {
  const { loading } = useGlobalContext();
  return (
    <div className="container">
      <Search />
      {loading ? (
        <div className="loading">
          <ThreeDots
            height="650"
            width="100"
            color="grey"
            ariaLabel="loading"
            className="loading"
          />
        </div>
      ) : (
        <>
          <CurrentWeather />
          <Forecast />
        </>
      )}
    </div>
  );
}

export default App;
