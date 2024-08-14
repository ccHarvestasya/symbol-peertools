// eslint-disable-next-line import/default
import log4js from 'log4js'

// eslint-disable-next-line import/no-named-as-default-member
log4js.configure({
  appenders: {
    rest: {
      daysToKeep: 90,
      filename: 'symbol-peertools.log',
      keepFileExt: true,
      layout: { type: 'basic' },
      pattern: 'yyyyMMdd',
      type: 'file',
    },
    watcher: {
      daysToKeep: 90,
      filename: 'symbol-peertools.log',
      keepFileExt: true,
      layout: { type: 'basic' },
      pattern: 'yyyyMMdd',
      type: 'file',
    },
    stdout: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['stdout'], level: 'all' },
    rest: { appenders: ['rest', 'stdout'], level: 'all' },
    watcher: { appenders: ['watcher', 'stdout'], level: 'all' },
  },
})

export class Logger {
  private logger_

  constructor(category?: string) {
    // eslint-disable-next-line import/no-named-as-default-member
    this.logger_ = log4js.getLogger(category)
  }

  debug(msg: string) {
    this.logger_.debug(msg)
  }

  error(msg: string) {
    this.logger_.error(msg)
  }

  fatal(msg: string) {
    this.logger_.fatal(msg)
  }

  info(msg: string) {
    this.logger_.info(msg)
  }

  trace(msg: string) {
    this.logger_.trace(msg)
  }

  warn(msg: string) {
    this.logger_.warn(msg)
  }

  shutdown(exitCode: string | number | undefined) {
    process.exitCode = exitCode
    log4js.shutdown(() => {
      process.on('exit', () => process.exit(exitCode))
    })
  }
}
