import { Args, Command, Flags } from '@oclif/core'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Logger } from '../../logger.js'
import pm2 from 'pm2'

export default class SymbolNodeWatcher extends Command {
  static description = 'Monitor Symbol node activity.'

  static args = {
    cmd: Args.string({ description: 'Monitor Symbol node activity Start or Stop.', required: true }),
  }

  static examples = [`<%= config.bin %> <%= command.id %> start`, `<%= config.bin %> <%= command.id %> stop`]

  static flags = {
    config: Flags.string({ char: 'c', default: './config.json', description: 'config file.', required: false }),
  }

  async run(): Promise<void> {
    const label = 'watcher'
    const logger = new Logger(label)

    const { args, flags } = await this.parse(SymbolNodeWatcher)

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(dirname(dirname(dirname(__filename))))
    const serviceJs = join(__dirname, './dist/watcher/pm2Service.js')

    pm2.connect((err) => {
      if (err) {
        logger.error(err.message)
        throw new Error(err.message)
      }

      switch (args.cmd) {
        case 'start': {
          pm2.start(
            {
              script: serviceJs,
              name: label,
              // eslint-disable-next-line camelcase
              node_args: `${serviceJs} ${flags.config}`,
              interpreter: 'node',
            },
            (err, _apps) => {
              if (err) {
                logger.error(err.message)
                return pm2.disconnect()
              }

              pm2.list((err, list) => {
                if (err) {
                  logger.error(err.message)
                  return pm2.disconnect()
                }

                const res = list.filter((item) => item.name === label)
                if (res.length !== 1 || res[0].pm2_env?.status?.toString() !== 'online') {
                  logger.error('Startup failed. Please check the log.')
                  return pm2.disconnect()
                }

                logger.info(`${label} is started.`)
                return pm2.disconnect()
              })
            }
          )

          break
        }

        case 'stop': {
          pm2.stop(label, (err, _proc) => {
            if (err) {
              logger.error(err.message)
              return pm2.disconnect()
            }

            pm2.list((err, list) => {
              if (err) {
                logger.error(err.message)
                return pm2.disconnect()
              }

              const res = list.filter((item) => item.name === label)
              if (res.length !== 1 || res[0].pm2_env?.status?.toString() !== 'stopped') {
                logger.error('Stop failed. Please check the log.')
                return pm2.disconnect()
              }

              pm2.delete(label, (err, _proc) => {
                if (err) {
                  logger.error(err.message)
                  return pm2.disconnect()
                }

                logger.info(`${label} is stopped.`)
                return pm2.disconnect()
              })
            })
          })

          break
        }

        case 'status': {
          pm2.list((_err, list) => {
            const res = list.filter((item) => item.name === label)
            if (res.length !== 1 || res[0].pm2_env?.status?.toString() !== 'online') {
              logger.info(`${label} is stopped.`)
            } else {
              logger.info(`${label} is started.`)
            }

            return pm2.disconnect()
          })

          break
        }

        default: {
          logger.error(`unknown command.`)
          pm2.disconnect()
        }
      }
    })
  }
}
