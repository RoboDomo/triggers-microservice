const debug = require("debug")("RULE"),
  console = require("console"),
  //  nodemailer = require("nodemailer"),
  //  transporter = nodemailer.createTransport({
  //    service: "gmail",
  //    auth: require("./gmail.js")
  //  }),
  MQTT = require("mqtt"),
  client = (this.client = MQTT.connect(process.env.MQTT_HOST)),
  Things = require("./Things");

class Rule {
  constructor() {
    this.timers = {};
  }

  async wait(time) {
    return new Promise((resolve /* , reject */) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  /**
   * Assure the thing is set to setting
   *
   * Retry once a second until the setting sticks
   */
  async assure(thing, key, value, time = 1000) {
    const t = Things[thing] || thing;
    debug(new Date().toLocaleDateString(), "  >>> assure", thing, key, value);
    if (String(t.state[key]) === String(value)) {
      console.log(t.name, key, "already ", value);
      return;
    }
    for (let retries = 1; retries < 4; retries++) {
      console.log(">>>> assure ", retries, t.name, key, t.state[key], value);
      if (String(t.state[key]) === String(value)) {
        return;
      }
      try {
        console.log(">>> change ", t.name, key, value);
        t.change(String(key), String(value));
      } catch (e) {
        debug("change exception", e.message, e.stack);
      }
      await this.wait(1000);
      if (String(t.state[key]) === String(value)) {
        return;
      }
      console.log("wait");
      await this.wait(time);
    }
  }

  publish(topic, message) {
    client.publish(topic, message);
  }

  say(message) {
    client.publish("say", message);
  }

  notify(message) {
    debug("notifiy", message);
    this.say(message);

    // send email
    transporter.sendMail(
      {
        from: "robodomo@sportstwo.me",
        //    to:      '7022497281@tmomail.net',
        to: "mike@mschwartz.me",
        subject: "",
        text: message
      },
      function(err, info) {
        debug("stack", err && err.stack);
        debug("info", info);
      }
    );

    // send text message
    //  transporter.sendMail({
    //    from:    'robodomo@sportstwo.me',
    //    to:      '7022497281@tmomail.net',
    //        to:      'mike@mschwartz.me',
    //    subject: '',
    //    text:    message,
    //  }, function(err, info) {
    //    console.log(err && err.stack)
    //    console.dir(info)
    //  })
  }
}

//
module.exports = Rule;
