const schedule = require("./lib/Schedule"),
  weather = require("./lib/Weather"),
  console = require("console");

require("./lib/Things");
require("./lib/Rules");

function main() {
  schedule.on("each-minute", date => {
    console.log("each-minute", date.toLocaleString());
  });
  schedule.on("each-hour", date => {
    console.log("each-hour", date.toLocaleString());
  });
  schedule.on("sunrise", date => {
    console.log("trigger sunrise", date, weather.sunrise.toLocaleString());
  });
  schedule.on("sunset", date => {
    console.log("trigger sunset", date, weather.sunset.toLocaleString());
  });
}

main();
