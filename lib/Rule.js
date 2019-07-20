const debug = require("debug")("RULE"),
  nodemailer = require("nodemailer"),
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: require("../gmail.js")
  }),
  MQTT = require("mqtt"),
  client = (this.client = MQTT.connect(process.env.MQTT_HOST)),
  Things = require("./Things");

class Rule {
  /**
   * Assure the thing is set to setting
   *
   * Retry once a second until the setting sticks
   */
  assure(thing, key, value, retry) {
    debug(new Date().toLocaleDateString(), "assure", key, value);
    const t = Things[thing] || thing;
    if (!t || !t.state || !t.state[key]) {
      return;
    }
    if (t.state[key] !== value) {
      debug(new Date().toLocaleDateString(), "change", key, value);
      t.change(key, value);
      if (retry === undefined || retry === true) {
        const timer = setInterval(() => {
          if (t.state[key] === value) {
            clearInterval(timer);
          } else {
            t.change(key, value);
          }
        }, 1000);
      }
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
