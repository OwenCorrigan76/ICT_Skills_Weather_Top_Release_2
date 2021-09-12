'use strict';
const stationControl = require('../models/stationControl.js');
const stationAnalytics = {

  
       getLastReading(station) {
        let lastReading = null;
        if (station.readings.length > 0) {
            lastReading = station.readings[0];
            for (let i = 1; i < station.readings.length; i++) {
                lastReading = station.readings[i];
             if (station.readings.length > 0) {
        station.lastReading = station.readings[station.readings.length - 1];
        }
            }
        }
        return lastReading;
    },
  
    setDate(){
    const d = new Date();
    let yyyy = d.getFullYear();
    let mm = d.getMonth()+1;
    let dd = d.getDate();
    let hh = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    let ms = d.getMilliseconds();
    return yyyy+"-"+mm+"-"+dd+" "+hh+":"+m+":"+s+"."+ms;
  },
  

    getTempTrend(readings) {
        let trend = "";
        let values = [];
        if (readings.length > 2) {
            values = [readings[readings.length - 3].temp, readings[readings.length - 2].temp, readings[readings.length - 1].temp];
        }
        if ((values[2] > values[1]) && (values[1] > values[0])) {
            trend = "arrow up";
        } else if ((values[2] < values[1]) && (values[1] < values[0])) {
            trend = "arrow down";
        }
        return trend;
    },


    getWindChill(temperature, windSpeed) {
        let y = 13.12 + 0.6215 * temperature - 11.37 * (windSpeed, 0.16) + 0.3965 * temperature * (windSpeed, 0.16);
        return y.toFixed(2) //two decimal places
    },


    getTempF(temp) {
        let y = (temp * 1.8) + 32;
        return y.toFixed(2) //two decimal places
    },


   
};
module.exports = stationAnalytics;