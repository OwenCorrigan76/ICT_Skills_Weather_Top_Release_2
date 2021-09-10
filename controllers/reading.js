"use strict";

const logger = require("../utils/logger");
const stationControl = require("../models/stationControl");

const reading = {
    index(request, response) {
        const stationId = request.params.id;
        const readingId = request.params.readingid;
        logger.debug(`Editing Reading ${readingId} from Station ${stationId}`);
        const viewData = {
            title: "Edit Reading",
            station: stationControl.getStation(stationId),
            reading: stationControl.getReading(stationId, readingId)
        };
        response.render("reading", viewData);
    },

    update(request, response) {
        const stationId = request.params.id;
        const readingId = request.params.readingid;
        const reading = stationControl.getReading(stationId, readingId)
        const newReading = {
            date: Number(request.body.date),
            code: Number(request.body.code),
            temp: Number(request.body.temp),
            windDirection: Number(request.body.windDirection),
            windSpeed: Number(request.body.windSpeed),
            pressure: Number (request.body.pressure),
            minTemp: Number(request.body.temp)
        };
        logger.debug(`Updating Reading ${readingId} from Station ${stationId}`);
        stationControl.updateReading(reading, newReading);
        response.redirect("/station/" + stationId);
    }
};

module.exports = reading;