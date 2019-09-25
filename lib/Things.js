const Config = require("../config"),
  StatefulEmitter = require("microservice-core/lib/StatefulEmitter"),
  MQTT = require("mqtt"),
  console = require("console");

function isNumeric(n) {
  return !isNaN(Number(n)) && isFinite(n);
}

class Thing extends StatefulEmitter {
  constructor(config) {
    super();
    this.state = {};
    this.topic = config.topic;
    this.type = config.type;
    this.name = config.name;
    console.log(
      new Date().toLocaleTimeString(),
      "constructing listener",
      config.name
    );
    const topic = (this.topic = config.topic),
      client = (this.client = MQTT.connect(process.env.MQTT_HOST));

    client.on("message", (topic, message) => {
      if (~topic.indexOf("/set")) {
        return;
      }
      topic = topic.substr(this.topic.length + 1);
      message = message
        .toString()
        .replace(/'/g, "")
        .replace(/"/g, "");
      if (isNumeric(message)) {
        message = Number(message);
      }
      const newState = {};
      newState[topic] = message;
      this.state = newState;
      //      if (this.name !== "Autelis") {
      //        console.log(
      //          new Date().toLocaleTimeString(),
      //          this.name,
      //          "topic",
      //          topic,
      //          "message",
      //          message
      //        );
      //      }
    });
    client.subscribe(topic + "/#");
  }
  change(key, value) {
    if (this.topic.substr(0, 7) === "hubitat") {
      this.client.publish(this.topic + "/set/" + key, String(value));
    } else {
      this.client.publish(this.topic + "/" + key + "/set", String(value));
    }
  }
}

class Things extends StatefulEmitter {
  constructor() {
    super();
    for (const config of Config.things) {
      const thing = (this[config.name] = new Thing(config));
      thing.on("statechange", (newState, oldState) => {
        this.emit(thing.name, newState, oldState);
        //        if (thing.type === "fan") {
        //          console.log(
        //            new Date().toLocaleTimeString(),
        //            thing.name,
        //            "newState",
        //            newState,
        //            "oldState",
        //            oldState
        //          );
        //        }
      });
    }
  }
}

module.exports = new Things();
