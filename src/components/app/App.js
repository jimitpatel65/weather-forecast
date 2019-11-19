import React, {Component} from 'react';
import SearchBar from '../searchbar/searchbar';
import WeatherInfo from '../weatherinfo/weatherinfo';
import {
  YOUR_PRIVATE_TOKEN,
  API_URL_TO_GET_GRIDPOINTS,
  API_URL_TO_GET_LAT_LONG,
  FORMAT
} from '../../utils/constants';
import moment from 'moment';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      weatherHourly: undefined,
      weatherWeekly: undefined
    }
  }

  getLatAndLong = async(areaOrZip) => {
    const geoCodeResp = await fetch(`${API_URL_TO_GET_LAT_LONG}?key=${YOUR_PRIVATE_TOKEN}&q=${areaOrZip}&format=${FORMAT}`);
    const geoCodeDetails = await geoCodeResp.json();
    return {
      lat: geoCodeDetails[0].lat,
      lon: geoCodeDetails[0].lon
    }
  }

  getGridPointsUrl = async(latAndLong) => {
    const getGridPoints = await fetch(`${API_URL_TO_GET_GRIDPOINTS}/${latAndLong.lat},${latAndLong.lon}`);
    const gridPoints = await getGridPoints.json();
    return {
      forecast: gridPoints.properties.forecast,
      forecastHourly: gridPoints.properties.forecastHourly,
    }
  }

  getWeatherHourly = async(gridPoints) => {
    const getWeatherHourly = await fetch(`${gridPoints.forecastHourly}`);
    const weatherHourly = await getWeatherHourly.json();
    return weatherHourly;
  }

  getWeatherWeekly = async(gridPoints) => {
    const getWeatherWeekly = await fetch(`${gridPoints.forecast}`);
    const weatherWeekly = await getWeatherWeekly.json();
    return weatherWeekly;
  }

  getCurrentWeather = (weatherHourly) => {
    let highTemp = 0;
    let lowTemp = 100;
    let hourlyArray = [];

    for(let i = 0; i <= weatherHourly.length; i++) {
      if(moment().date() !== moment(weatherHourly[i].startTime).date()){
        break;
      } 

      if(weatherHourly[i].temperature > highTemp) {
        highTemp = weatherHourly[i].temperature;
      }
      
      if(weatherHourly[i].temperature < lowTemp) {
        lowTemp = weatherHourly[i].temperature;
      }
      
      hourlyArray.push({
        currentTime : moment(weatherHourly[i].startTime).hours(),
        currentTemp: weatherHourly[i].temperature
      });
    }

    return {
      highTemp: highTemp,
      lowTemp: lowTemp,
      hourlyTemp : hourlyArray
    }
  }

  getCurrentWeekDetails = (currentWeekDetails) => {
    return currentWeekDetails.reduce((prev,current) => {
      if(!prev[moment(current.startTime).isoWeekday()]) {
        prev[moment(current.startTime).isoWeekday()] = {
          day: current.name,
          shortForecast: current.shortForecast,
          temp1: current.temperature 
        }
      } else{
        prev[moment(current.startTime).isoWeekday()] = {
          ...prev[moment(current.startTime).isoWeekday()],
          temp2: current.temperature
        }
      }
      return prev;
    },{})
  }

  getWeatherInfo = async(areaOrZip) => {
    try {
      const latAndLong = await this.getLatAndLong(areaOrZip);
      const gridPoints = await this.getGridPointsUrl(latAndLong);
      const getWeatherHourly =  this.getWeatherHourly(gridPoints);
      const getWeatherWeekly =  this.getWeatherWeekly(gridPoints);
      const weatherHourly = await getWeatherHourly;
      const weatherWeekly = await getWeatherWeekly;
      let weatherInfo = {
        currentWeatherTemp: this.getCurrentWeather(weatherHourly.properties.periods),
        weatherWeekly: this.getCurrentWeekDetails(weatherWeekly.properties.periods)
      };
      this.setState({
        weatherHourly: weatherInfo.currentWeatherTemp,
        weatherWeekly: weatherInfo.weatherWeekly
      });
    } catch(e) {
      this.setState({
        weatherHourly: undefined,
        weatherWeekly: undefined
      })
      console.log("Error While fetching data", e);
    }
  }

  render() {
    return (
      <div className="App">
        <h1 className="App-header">Weather Forecast</h1>
        <SearchBar getWeatherInfo={this.getWeatherInfo}/>
        {
          this.state.weatherHourly ?
           <WeatherInfo weatherHourly = {this.state.weatherHourly} weatherWeekly={this.state.weatherWeekly} /> : 
           <p>Enter Correct Zip Code or Address and press Enter...</p>}
      </div>
    );
  }
}

export default App;
