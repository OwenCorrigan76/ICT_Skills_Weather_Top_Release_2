"use strict";

const logger = require("../utils/logger");
const stationControl = require("../models/stationControl.js");
const uuid = require("uuid");
const accounts = require("./accounts.js");
const axios = require("axios");
const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=52.160858&lon=-7.152420&units=metric&appid=b425f2808859b7f10ed16f168702a1a5`
const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);

    const stations = stationControl.getUserStation(loggedInUser.id);
    for (let i = 0; i < stations.length; i++) {
      let station = stations[i];
      if (station.readings.length > 0) {
        station.lastReading = station.readings[station.readings.length - 1];
      }
    }
    
    const viewData = {
      title: "Weather Top",
      station: stations
    };
    logger.info("about to render", stationControl.getAllStations());
    response.render("dashboard", viewData);
  },
  
   async addreport(request, response) {
    logger.info("rendering new report");
    let report = {};
    const lat = request.body.lat;
    const lng = request.body.lng;
    const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=YOUR_API_KEY_HERE`
    const result = await axios.get(requestUrl);
    if (result.status == 200) {
      const reading = result.data.current;
      report.code = reading.weather[0].id;
      report.temperature = reading.temp;
      report.windSpeed = reading.wind_speed;
      report.pressure = reading.pressure;
      report.windDirection = reading.wind_deg;
    }
    console.log(report);
    const viewData = {
      title: "Weather Report",
      reading: report
    };
    response.render("dashboard", viewData);
  },

  addStation(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newStation = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      station: request.body.station,
      latitude: request.body.latitude,
      longitude: request.body.longitude,
      readings: []
    };
    logger.debug("Creating a new Station", newStation);
    stationControl.addStation(newStation);
    response.redirect("/dashboard");
  },

  deleteReading(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingId;
    logger.debug(`Deleting Reading ${readingId} from Station ${stationId}`);
    stationControl.removeReading(stationId, readingId);
    response.redirect("/station/" + stationId);
  },

  deleteStation(request, response) {
    const stationId = request.params.id;
    logger.debug(`Deleting Station ${stationId}`);
    stationControl.removeStation(stationId);
    response.redirect("/dashboard");
  }
};

module.exports = dashboard;
