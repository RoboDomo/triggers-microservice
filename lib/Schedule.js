const StatefulEmitter = require("microservice-core/lib/StatefulEmitter"),
  cron = require("node-schedule");
//const console         = require('console')

class Schedule extends StatefulEmitter {
  constructor() {
    super();
    this.schedule = {};
    this.create("each-minute", "* * * * *"); // fires every minute
    this.create("each-hour", "0 * * * *"); // fires every hour
  }
  cancel(what) {
    const timer = this.schedule[what];
    if (timer) {
      timer.cancel();
      delete this.schedule[what];
    }
  }
  create(what, date) {
    this.cancel(what);
    this.schedule[what] = cron.scheduleJob(date, () => {
      this.emit(what, new Date(), date);
    });
  }
}
module.exports = new Schedule();
