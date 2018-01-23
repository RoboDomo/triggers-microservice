const Config          = require('../config'),
      StatefulEmitter = require('microservice-core/lib/StatefulEmitter'),
      MQTT            = require('mqtt'),
      schedule        = require('./Schedule'),
      console         = require('console')

class Weather extends StatefulEmitter {
  constructor(topic) {
    super()
    console.log('construct Weather', topic)
    this.state = {}
    const client = this.client = MQTT.connect(process.env.MQTT_HOST)
    this.topic = topic
    
    client.on('message', (topic, message) => {
      try {
        message = JSON.parse(message.toString())
        const sunrise = new Date(message.sunrise *1000),
              sunset = new Date(message.sunset * 1000),
              now = new Date()

        console.log('weather', now.toLocaleString())
        console.log('  sunrise', sunrise.toLocaleString())
        console.log('  sunset', sunset.toLocaleString())
        this.state = {
          sunrise: sunrise,
          sunset:  sunset,
        }
        schedule.create('sunrise', this.state.sunrise)
        schedule.create('sunset', this.state.sunset)
        if (now > sunset) {
          console.log('Weather after sunset, trigger')
          schedule.emit('sunset', sunset)
        }
        else if (now > sunrise) {
          console.log('Weather after sunrise, trigger')
          schedule.emit('sunrise', sunrise)
        }
      }
      catch (e) {
        console.log('exception', e)
      }
    })
    client.subscribe(topic)
  }
  get sunrise() {
    return this.state.sunrise
  }
  get sunsete() {
    return this.state.sunset
  }
}
module.exports = new Weather(Config.weather)
