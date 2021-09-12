"use strict";

const logger = require("../utils/logger");
const stationControl = require("../models/stationControl");
const stationAnalytics = require("../utils/station-analytics");
const conversions = require("../utils/conversions");
const uuid = require("uuid");


const station = {
  index(request, response) {
    const stationId = request.params.id;
    logger.debug("Station id = ", stationId);
    const station = stationControl.getStation(stationId);
    const minTemp = stationControl.getMinTemp(station);
    const maxTemp = stationControl.getMaxTemp(station);
    const minWind = stationControl.getMinWindSpeed(station);
    const maxWind = stationControl.getMaxWindSpeed(station);
    const minPressure = stationControl.getMinPressure(station);
    const maxPressure = stationControl.getMaxPressure(station);
    const lastReading = stationAnalytics.getLastReading(station);

    let fahrenheit = null;
    let windChill = null;
    let windSpeed = null;
    let windDirection = null;
    let weatherCodes = null;
    let weatherIcon = null;
    let beafourt = null;
    let latitude = null;
    let longitude = null;


    if (station.readings.length > 0) {//if there is a reading
      fahrenheit = stationAnalytics.getTempF(Number(lastReading.temp));
      windChill = stationAnalytics.getWindChill(Number(lastReading.temp));
      windDirection = conversions.getWindDirection(Number(lastReading.windDirection));
      beafourt = conversions.getBeafourt(Number(lastReading.windSpeed));
      weatherCodes = conversions.getWeatherCodes(Number(lastReading.code));
      weatherIcon = conversions.getWeatherCodeIcons(Number(lastReading.code));

    }
    console.log(lastReading, windChill, fahrenheit, weatherCodes, minTemp);
    const viewData = {
      title: "station",
      station: stationControl.getStation(stationId),
      latitude: latitude,
      longitude: longitude,
      lastReading: lastReading,
      windChill: windChill,
      fahrenheit: fahrenheit,
      weatherCodes: weatherCodes,
      weatherIcon: weatherIcon,
      windSpeed: windSpeed,
      windDirection: windDirection,
      beafourt: beafourt,
      minTemp: minTemp,
      maxTemp: maxTemp,
      minWind: minWind,
      maxWind: maxWind,
      minPressure: minPressure,
      maxPressure: maxPressure
    };
    response.render("station", viewData);
  },


  deleteReading(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    logger.debug(`Deleting Reading ${readingId} from Station ${stationId}`);
    stationControl.removeReading(stationId, readingId);
    response.redirect("/station/" + stationId);
  },


  addReading(request, response) {
    const stationId = request.params.id;
    const station = stationControl.getStation(stationId);
    let date = stationAnalytics.setDate();
    const newReading = {
      id: uuid.v1(),
      station: request.body.station,
      date: date,
      code: request.body.code,
      temp: request.body.temp,
      windDirection: request.body.windDirection,
      windSpeed: request.body.windSpeed,
      pressure: request.body.pressure
    };
    stationControl.addReading(stationId, newReading);
    response.redirect("/station/" + stationId);
  }
};
module.exports = station;
