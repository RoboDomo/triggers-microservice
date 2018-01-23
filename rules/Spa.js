const Rule = require('../lib/Rule'),
      schedule = require('../lib/Schedule'),
      things = require('../lib/Things'),
      console = require('console'),
      nodemailer = require('nodemailer'),
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:    require(process.env.GMAIL_CREDENTIALS)
      })


const notify = (message) => {
  console.log('notifiy', message)
  // send email
  transporter.sendMail({
    from:    'robodomo@sportstwo.me',
    //    to:      '7022497281@tmomail.net',
    to:      'mike@mschwartz.me',
    subject: '',
    text:    message,
  }, function(err, info) {
    console.log(err && err.stack)
    console.dir(info)
  })
  // send text message
  transporter.sendMail({
    from:    'robodomo@sportstwo.me',
    to:      '7022497281@tmomail.net',
    //    to:      'mike@mschwartz.me',
    subject: '',
    text:    message,
  }, function(err, info) {
    console.log(err && err.stack)
    console.dir(info)
  })
}

//notify('testing')
class Spa extends Rule {
  isOn() {
    const state = this.thing.state
    return state.pump === 'on' && state.spa === 'on'
  }

  constructor() {
    super()
    console.log('construct spa')
    this.thing = things['Autelis']
    this.state = 'off'
    this.monitor()
  }

  monitor() {
    this.timer = 0
    schedule.on('each-minute', () => {
      const state = this.thing.state,
            heat = Boolean(state.spaht === 'on' || state.spaht === 'enabled'),
            temp  = (heat && this.timer <= 0) ? Number(state.spatemp) : Number(state.pooltemp),
            setpoint = Number(state.spasp)

      console.log('spa monitor state ', this.state, 'heat', heat, 'temp', temp, 'setpoint', setpoint)
      switch(this.state) {
        case 'off':
          if (this.isOn()) {
            this.state = 'on'
          }
          break
        case 'on':
          if (heat) {
            this.state = 'heating'
            this.timer = 5      // give it 5 minutes to have the spa temperature be accurate
          }
          break
        case 'heating':
          if (--this.timer <= 0 && temp >= 90) {
            this.state = 'warm'
            notify('Spa is ' + temp + ' degrees')
          }
          break
        case 'warm':
          if (temp >= setpoint) {
            notify('Spa set point reached: ' + temp + ' degrees')
            this.state = 'heated'
          }
          break
        case 'heated':
          if (!this.isOn()) {
            this.state = 'off'
          }
          break
      }
    })
  }
}
module.exports = Spa
