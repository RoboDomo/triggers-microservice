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
  things = require("../lib/Things"),
  console = require("console");

const TIMEOUT = Number(process.env.TIMEOUT) || 10 * 60 * 1000;

const log = (...args) => {
  const d = new Date();
  console.log(d.toLocaleTimeString(), ...args);
};

log("TIMEOUT", TIMEOUT);

class BathroomFans extends Rule {
  clear(name) {
    if (this.timeouts[name]) {
      log(">>>>>> CLEAR", name);
      clearTimeout(this.timeouts[name]);
    }
    this.timeouts[name] = null;
  }

  start(name) {
    try {
      if (this.timeouts[name]) {
        return;
      }
      // don't start if fan switch is off
      if (this.sw !== "on") {
        this.clear(name);
        return;
      }
      // don't start if other switch(es) on
      for (const sw of this.switches[name]) {
        if (sw.state === "on") {
          this.clear(name);
          return;
        }
      }
      this.clear(name);
      log(">>>>>>> START", name);
      this.timeouts[name] = setTimeout(() => {
        this.clear(name);
        log("TIMEDOUT, assure", name, " is off");
        this.assure(name, "switch", "off");
      }, TIMEOUT);
    } catch (e) {
      log("name", name, e);
    }
  }

  constructor() {
    super();

    // hash map of setTimeout() handles, indexed by fan name
    this.timeouts = {};

    // these are the fans that will be monitored
    this.fans = [
      things["Hall Bath Fan"],
      things["Bathroom Fan"],
      things["Toilet Fan"],
      things["Bathroom Light"]
    ];

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
      ],
      "Bathroom Fan": [
        {
          name: "Bathroom Light",
          sw: things["Bathroom Light"],
          state: "off"
        },
        {
          name: "Bathroom Switch",
          sw: things["Bathroom Switch"],
          state: "off"
        },
        {
          name: "Closet Light",
          sw: things["Closet Light"],
          state: "off"
        }
      ],
      "Bathroom Light": [
        {
          name: "Bathroom Switch",
          sw: things["Bathroom Switch"],
          state: "off"
        },
        {
          name: "Closet Light",
          sw: things["Closet Light"],
          state: "off"
        }
      ],
      "Toilet Fan": [
        {
          name: "Bathroom Switch",
          sw: things["Bathroom Switch"],
          state: "off"
        },
        {
          name: "Closet Light",
          sw: things["Closet Light"],
          state: "off"
        }
      ]
    };

    this.sw = "off";

    for (const fan of this.fans) {
      // listen for other bathroom switches to monitor state
      for (const sw of this.switches[fan.name]) {
        sw.sw.on("statechange", newState => {
          sw.state = newState["switch"];
          //          log(
          //            "LIGHT statechange",
          //            sw.name,
          //            newState,
          //            newState.switch,
          //            sw.state
          //          );
          if (sw.state === "on") {
            log("statechange clear", fan.name);
            this.clear(fan.name);
          } else {
            log("statechange start", fan.name);
            this.start(fan.name);
          }
        });
      }

      fan.on("statechange", newState => {
        log("FAN ", fan.name, "statechange", newState);
        if (newState["switch"] === "on") {
          this.sw = "on";
        } else {
          this.sw = "off";
        }
        // maybe start
        this.start(fan.name);
      });
    }
  }
}

//
module.exports = BathroomFans;
