// eslint-disable-next-line import/default
import log4js from 'log4js'

// eslint-disable-next-line import/no-named-as-default-member
log4js.configure({
  appenders: {
    rest: {
      daysToKeep: 90,
      filename: 'rest.log',
      keepFileExt: true,
      layout: { type: 'basic' },
      pattern: '.yyyyMMdd',
      type: 'file',
    },
    stdout: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['stdout'], level: 'all' },
    rest: { appenders: ['stdout', 'rest'], level: 'all' },
  },
})

export class Logger {
  private logger_

  constructor(category?: string) {
    // eslint-disable-next-line import/no-named-as-default-member
    this.logger_ = log4js.getLogger(category)
  }

  debug(msg: string) {
    console.log(msg)
    this.logger_.debug(msg)
  }

  error(msg: string) {
    console.log(msg)
    this.logger_.error(msg)
  }

  fatal(msg: string) {
    console.log(msg)
    this.logger_.fatal(msg)
  }

  info(msg: string) {
    console.log(msg)
    this.logger_.info(msg)
  }

  trace(msg: string) {
    console.log(msg)
    this.logger_.trace(msg)
  }

  warn(msg: string) {
    console.log(msg)
    this.logger_.warn(msg)
  }
}
