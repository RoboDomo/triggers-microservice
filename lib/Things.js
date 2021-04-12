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
      config.name,
      config.topic,
      config.type
    );
    const topic = (this.topic = config.topic),
      client = (this.client = MQTT.connect(process.env.MQTT_HOST));

    //    console.log("topic", topic);
    client.on("message", (topic, message) => {
      message = message
        .toString()
        .replace(/'/g, "")
        .replace(/"/g, "");
      //      console.log("message", topic, message);
      if (~topic.indexOf("/set")) {
        return;
      }
      //      console.log("message", topic, "=> ", message.toString());
      topic = topic.substr(this.topic.length + 1).replace("status/", "");
      if (isNumeric(message)) {
        message = Number(message);
      }
      const newState = {};
      newState[topic] = message;
      this.state = newState;
    });
    client.subscribe(topic + "/#");
  }

  change(key, value) {
    if (
      this.topic.substr(0, 7) === "hubitat" ||
      this.topic.substr(0, 3) === "myq"
    ) {
      this.client.publish(this.topic + "/set/" + key, String(value));
    } else {
      this.client.publish(this.topic + "/" + key, String(value));
    }
  }
}

class Things extends StatefulEmitter {
  constructor() {
    super();
    for (const config of Config.things) {
      const thing = (this[config.name] = new Thing(config));
      thing.on("statechange", (newState, oldState) => {
        //        console.log("statechange", newState, oldState);
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
