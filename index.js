process.env.DEBUG += ":OUTDOORS";
process.title = process.env.TITLE || "triggers-microservice";

const schedule = require("./lib/Schedule"),
  MQTT = require("mqtt"),
  os = require("os"),
  weather = require("./lib/Weather"),
  console = require("console");

require("./lib/Things");
require("./lib/Rules");

function exit(client, message) {
  try {
    const packet = JSON.stringify({
      type: "alert",
      host: os.hostname(),
      title: "WARNING",
      message: [message],
    });
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("alert", message);
    client.publish("alert", packet, { retain: false });
  } catch (e) {}
  setTimeout(() => {
    process.exit(0);
  }, 3000);
}

function main() {
  const client = MQTT.connect(process.env.MQTT_HOST);
  client.on("connect", () => {
    const packet = JSON.stringify({
      type: "alert",
      host: os.hostname(),
      title: "WARNING",
      message: [`${process.title} running`],
    });
    client.publish("alert", packet, { retain: false });
    client.subscribe("triggers/reset/#");
  });
  client.on("message", () => {
    exit(client, "triggers-microservice restarting");
  });
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
