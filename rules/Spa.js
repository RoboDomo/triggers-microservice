const Rule = require("../lib/Rule"),
  schedule = require("../lib/Schedule"),
  things = require("../lib/Things"),
  console = require("console");

//notify('testing')
class Spa extends Rule {
  isOn() {
    const state = this.thing.state;
    return state.pump === "on" && state.spa === "on";
  }

  constructor() {
    super();
    this.thing = things["Autelis"];
    this.state = "off";
    this.monitor();
  }

  monitor() {
    this.timer = 0;
    schedule.on("each-minute", () => {
      const state = this.thing.state,
        heat = Boolean(state.spaht === "on" || state.spaht === "enabled"),
        temp =
          heat && this.timer <= 0
            ? Number(state.spatemp)
            : Number(state.pooltemp),
        setpoint = Number(state.spasp);

      console.log(
        new Date().toLocaleTimeString(),
        "spa monitor state ",
        this.state,
        "heat",
        heat,
        "temp",
        temp,
        "setpoint",
        setpoint
      );
      switch (this.state) {
        case "off":
          if (this.isOn()) {
            this.state = "on";
          }
          break;
        case "on":
          if (heat) {
            this.state = "heating";
            this.timer = 5; // give it 5 minutes to have the spa temperature be accurate
          }
          break;
        case "heating":
          if (--this.timer <= 0 && temp >= 90) {
            this.state = "warm";
            this.notify("Spa is " + temp + " degrees");
          }
          break;
        case "warm":
          if (temp >= setpoint) {
            this.notify("Spa set point reached: " + temp + " degrees");
            this.state = "heated";
          }
          break;
        case "heated":
          if (!this.isOn()) {
            this.state = "off";
          }
          break;
      }
    });
  }
}

module.exports = Spa;
