const debug = require("debug")("WEATHER"),
  Config = require("../config"),
  StatefulEmitter = require("microservice-core/lib/StatefulEmitter"),
  MQTT = require("mqtt"),
  schedule = require("./Schedule");

class Weather extends StatefulEmitter {
  constructor(topic) {
    super();
    debug("construct Weather", topic);
    this.state = {};
    const client = (this.client = MQTT.connect(process.env.MQTT_HOST));
    this.topic = topic;

    let last_trigger = null;

    client.on("message", (topic, message) => {
      try {
        message = JSON.parse(message.toString());
        const sunrise = new Date(message.sunrise * 1000),
          sunset = new Date(message.sunset * 1000),
          now = new Date();

        debug("weather", now.toLocaleString());
        debug("  sunrise", sunrise.toLocaleString());
        debug("  sunset", sunset.toLocaleString());
        this.state = {
          sunrise: sunrise,
          sunset: sunset
        };
        schedule.create("sunrise", this.state.sunrise);
        schedule.create("sunset", this.state.sunset);
        if (now > sunset) {
          debug(
            new Date().toLocaleString(),
            ">>>> Weather after sunset, trigger"
          );
          if (last_trigger !== "sunset") {
            client.publish("say", "It is now sunset");
            last_trigger = "sunset";
          }
          schedule.emit("sunset", sunset);
        } else if (now > sunrise) {
          debug(
            new Date().toLocaleString(),
            ">>>>  Weather after sunrise, trigger"
          );
          if (last_trigger !== "sunrise") {
            client.publish("say", "It is now sunrise");
            last_trigger = "sunrise";
          }
          schedule.emit("sunrise", sunrise);
        }
      } catch (e) {
        debug(new Date().toLocaleString(), "exception", e);
      }
    });
    debug(new Date().toLocaleString(), "topic", topic);
    client.subscribe(topic);
  }
  get sunrise() {
    return this.state.sunrise;
  }
  get sunsete() {
    return this.state.sunset;
  }
}

module.exports = new Weather(Config.weather);
