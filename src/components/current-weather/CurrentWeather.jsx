import React from 'react'
import "./CurrentWeather.css";


const CurrentWeather = () => {
  return (
    <div className='weather'>
        <div className="top">
            <p className='city'>Kolkata</p>
            <p className='weather-desc'>Sunny</p>
        </div>
        <img src="" alt="weather" className='weather-icon' />
    </div>
  )
}

export default CurrentWeather