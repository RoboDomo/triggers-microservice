process.env.DEBUG += ":OUTDOORS";
const schedule = require("./lib/Schedule"),
  weather = require("./lib/Weather"),
  console = require("console");

require("./lib/Things");
require("./lib/Rules");

function main() {
  schedule.on("each-minute", (date) => {
    try {
      console.log(
        new Date().toLocaleTimeString(),
        "each-minute",
        date.toLocaleString()
      );
    } catch (e) {
      console.log("Exception ", e.message, "date", date);
    }
  });
  schedule.on("each-hour", (date) => {
    try {
      console.log(
        new Date().toLocaleTimeString(),
        "each-hour",
        date.toLocaleString()
      );
    } catch (e) {
      console.log("Exception ", e.message, "date", date);
    }
  });
  schedule.on("sunrise", (date) => {
    try {
      console.log(
        new Date().toLocaleTimeString(),
        "trigger sunrise",
        date,
        weather.sunrise.toLocaleString()
      );
    } catch (e) {
      console.log("Exception ", e.message, "weather", weather);
    }
  });
  schedule.on("sunset", (date) => {
    try {
      console.log(
        new Date().toLocaleTimeString(),
        "trigger sunset",
        date,
        weather.sunset.toLocaleString()
      );
    } catch (e) {
      console.log("Exception ", e.message, "weather", weather);
    }
  });
}

//
main();
