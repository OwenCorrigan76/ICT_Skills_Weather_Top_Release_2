"use strict";
const _ = require("lodash");
const JsonStore = require("./json-store");


const stationControl = {
    store: new JsonStore('./models/stationControl.json', {stationCollection: []}),
    collection: 'stationCollection',

   /** getUserStation(userid) {
        return this.store.findBy(this.collection, {userid: userid});
    },**/

    getUserStation(loggedInUser) {
        let stations = this.store.findBy(this.collection, { userid: loggedInUser})
        const orderedStations = _.sortBy(stations, o => o.station)//sorts  by alphabetical
        return orderedStations;
    },
    getAllStations() {
        return this.store.findAll(this.collection);
    },

    getStation(id) {
        return this.store.findOneBy(this.collection, {id: id});
    },

    getMinTemp(station) {
        let minTemp = null;
        if (station.readings.length > 0) {
            minTemp = station.readings [0];
            for (let i = 1; i < station.readings.length; i++) {
                if (station.readings[i].temp < minTemp.temp)
                    minTemp = station.readings[i];
            }
        }
        return minTemp;
    },

    getMaxTemp(station) {
        let maxTemp = null;
        if (station.readings.length > 0) {
            maxTemp = station.readings [0];
            for (let i = 1; i < station.readings.length; i++) {
                if (station.readings[i].temp > maxTemp.temp)
                    maxTemp = station.readings[i];
            }
        }
        return maxTemp;
    },

    getMinWindSpeed(station) {
        let minWind = null;
        if (station.readings.length > 0) {
            minWind = station.readings [0].windSpeed;
            for (let i = 1; i < station.readings.length; i++) {
                if (station.readings[i].windSpeed < minWind.windSpeed)
                    minWind = station.readings[i];
            }
        }
        return minWind;
    },

    getMaxWindSpeed(station) {
        let maxWind = null;
        if (station.readings.length > 0) {
            maxWind = station.readings [0].windSpeed;
            for (let i = 1; i < station.readings.length; i++) {
                if (station.readings[i].windSpeed > maxWind.windSpeed)
                    maxWind = station.readings[i];
            }
        }
        return maxWind;
    },

    getMinPressure(station) {
        let minPressure = null;
        if (station.readings.length > 0) {
            minPressure = station.readings [0].pressure;
            for (let i = 1; i < station.readings.length; i++) {
                if (station.readings[i].pressure < minPressure.pressure)
                    minPressure = station.readings[i];
            }
        }
        return minPressure;
    },

    getMaxPressure(station) {
        let maxPressure = null;
        if (station.readings.length > 0) {
            maxPressure = station.readings[0].pressure;
            for (let i = 1; i < station.readings.length; i++) {
                if (station.readings[i].pressure > maxPressure.pressure)
                    maxPressure = station.readings[i];
            }
        }
        return maxPressure;
    },


    addStation(station) {
        this.store.add(this.collection, station);
        this.store.save();
    },
    removeStation(id) {
        const station = this.getStation(id);
        this.store.remove(this.collection, station);
        this.store.save();
    },

    addReading(id, reading) {
        const station = this.getStation(id);
        station.readings.push(reading);

        let code = 0;
        for (let i = 0; i < station.readings.length; i++) {
            code += station.readings[i].duration;
        }
        station.code = code;
        this.store.save();
    },

    removeReading(id, readingId) {
        const station = this.getStation(id);
        _.remove(station.readings, {id: readingId});
        this.store.save();
    },

    getReading(id, readingId) {
        const station = this.store.findOneBy(this.collection, {id: id});
        const readings = station.readings.filter(reading => reading.id === readingId);
        return readings[0];
    },

    updateReading(reading, updatedReading) {
        reading.station = updatedReading.station;
        reading.code = updatedReading.code;
        reading.temp = updatedReading.temp;
        reading.windDirection = updatedReading.windDirection;
        reading.windSpeed = updatedReading.windSpeed;
        reading.pressure = updatedReading.pressure;
        this.store.save();
    },
};
module.exports = stationControl;