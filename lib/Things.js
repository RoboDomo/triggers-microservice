const Config          = require('../config'),
      StatefulEmitter = require('microservice-core/lib/StatefulEmitter'),
      MQTT            = require('mqtt'),
      console         = require('console')

function isNumeric(n) {
  return !isNaN(Number(n)) && isFinite(n)
}

class Thing extends StatefulEmitter {
  constructor(config) {
    super()
    this.state = {}
    this.topic = config.topic
    this.type = config.type
    this.name = config.name
    console.log('constructing listener', config.name)
    const topic = this.topic = config.topic,
          client = this.client = MQTT.connect(process.env.MQTT_HOST)

    client.on('message', (topic, message) => {
      topic = topic.substr(this.topic.length+1)
      message = message.toString().replace(/'/g, '').replace(/"/g, '')
      if (isNumeric(message)) {
        message = Number(message)
      }
      const newState = {}
      newState[topic] = message
      this.state = newState
    })
    client.subscribe(topic + '/#')
  }
  change(key, value) {
    this.client.publish(this.topic + '/' + key + '/set', String(value))
  }
}

class Things extends StatefulEmitter {
  constructor() {
    super()
    for (const config of Config.things) {
      const thing = this[config.name] = new Thing(config)
      thing.on('statechange', (newState, oldState) => {
        this.emit(thing.name, newState, oldState)
        //        console.log(thing.name, 'newState', newState, 'oldState', oldState)
      })
    }
  }
}  

module.exports = new Things()
