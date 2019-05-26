/**
 * Bathroom Fans rule
 *
 * I have two bathrooms, and each has an exhaust fan.  I want to turn on the fan, and have it turn off after some
 * amount of time (10 minutes) if I don't turn it off manually.
 *
 * However, I want to be able to run the fan indefinitely, as when I take a shower longer than the 5 minutes.  Thus,
 * if any other lights are on in the bathroom, the timeout is disabled.
 */
const Rule = require("../lib/Rule"),
  //  schedule = require("../lib/Schedule"),
  things = require("../lib/Things"),
  console = require("console");

//const TIMEOUT = 10 * 60 * 1000;
const TIMEOUT = 10 * 1000;

class BathroomFans extends Rule {
  clear(name) {
    console.log("clear", name);
    if (this.timeouts[name]) {
      clearTimeout(this.timeouts[name]);
    }
    this.timeouts[name] = null;
  }

  start(name) {
    try {
      this.clear(name);
      // don't start if fan switch is off
      if (this.sw !== "on") {
        return;
      }
      // don't start if other switch(es) on
      for (const sw of this.switches[name]) {
        if (sw.state === "on") {
          return;
        }
      }
      console.log("START", name);
      this.timeouts[name] = setTimeout(() => {
        this.clear(name);
        this.assure(name, "switch", "off");
      }, TIMEOUT);
    } catch (e) {
      console.log("name", name, e);
    }
  }

  constructor() {
    super();

    // hash map of setTimeout() handles, indexed by fan name
    this.timeouts = {};

    // these are the fans that will be monitored
    this.fans = [things["Hall Bath Fan"]];

    // these are the switches in the bathroom(s) that will also be monitored
    this.switches = {
      "Hall Bath Fan": [
        {
          name: "Hall Bath Dimmer",
          sw: things["Hall Bath Dimmer"],
          state: "off"
        },
        {
          name: "Hall Bath Lights",
          sw: things["Hall Bath Lights"],
          state: "off"
        }
      ]
    };

    this.sw = "off";

    for (const fan of this.fans) {
      // listen for other bathroom switches to monitor state
      this.name = fan.name;
      for (const sw of this.switches[fan.name]) {
        sw.sw.on("statechange", newState => {
          sw.state = newState["switch"];
          if (sw.state === "on") {
            this.clear(this.name);
          } else {
            this.start(this.name);
          }
        });
      }

      fan.on("statechange", newState => {
        console.log("newState", newState["switch"]);
        if (newState["switch"] === "on") {
          this.sw = "on";
        } else {
          this.sw = "off";
        }
        // maybe start
        this.start(this.name);
      });
    }
  }
}

//
module.exports = BathroomFans;
