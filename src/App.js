import "./App.css";
import Search from "./components/search/Search";
import CurrentWeather from "./components/current-weather/CurrentWeather";

function App() {
  const handleonSearchChange = (searchData) => {};
  return (
    <div className="App">
      <Search onSearchChange={handleonSearchChange} />
      <CurrentWeather />
    </div>
  );
}

export default App;
