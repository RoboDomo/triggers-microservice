const Rule = require("../lib/Rule"),
  schedule = require("../lib/Schedule"),
  things = require("../lib/Things"),
  console = require("console");

class GarageDoor extends Rule {
  isOpen() {
    for (const sensor of this.sensors) {
      if (sensor.state.contact !== "closed") {
        return true;
      }
    }
    return false;
  }
  sensorName(n) {
    return n.replace(/\s+Sensor/, "");
  }

  constructor() {
    super();
    this.intervals = {};
    console.log("construct GarageDoor");
    this.sensors = [things["Cart Door Sensor"], things["Garage Door Sensor"]];
    for (const sensor of this.sensors) {
      sensor.on("statechange", newState => {
        console.log(sensor.name, "statechange", newState);
        if (newState.contact !== "closed") {
          this.triggerOpen(sensor);
        } else {
          if (this.intervals[sensor.name]) {
            this.say(this.sensorName(sensor.name) + " is now closed");
            if (!this.isOpen()) {
              clearInterval(this.intervals[sensor.name]);
              this.intervals[sensor.name] = null;
            }
          }
        }
      });
    }
  }

  triggerOpen(sensor) {
    if (this.intervals[sensor.name]) {
      return;
    }
    this.say(this.sensorName(sensor.name) + " is open");
    this.intervals[sensor.name] = setInterval(() => {
      if (this.isOpen()) {
        this.say(this.sensorName(sensor.name) + " is open");
        this.notify(this.sensorName(sensor.name) + " is open");
      } else {
        clearInterval(this.intervals[sensor.name]);
        this.intervals[sensor.name] = null;
      }
    }, 15 * 60 * 1000); // every 15 minutes
  }
}

module.exports = GarageDoor;
