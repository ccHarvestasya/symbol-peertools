import { Args, Command, Flags } from '@oclif/core'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pm2 from 'pm2'
import { Logger } from '../../logger.js'

export default class Rest extends Command {
  static description = 'REST for peer node.'

  static args = {
    cmd: Args.string({ description: 'REST Server Start or Stop', required: true }),
  }

  static examples = [
    `<%= config.bin %> <%= command.id %> start`,
    `<%= config.bin %> <%= command.id %> start -c ./symbol-peertools/config.json`,
    `<%= config.bin %> <%= command.id %> stop`,
  ]

  static flags = {
    config: Flags.string({ char: 'c', default: './config.json', description: 'config file.', required: false }),
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Rest)

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(dirname(dirname(dirname(__filename))))
    const serviceJs = join(__dirname, './dist/rest/pm2Service.js')

    pm2.connect((err) => {
      if (err) {
        console.error(err)
        process.exit(-1)
      }
      if (args.cmd === 'start') {
        pm2.start(
          {
            script: serviceJs,
            name: 'rest',
            node_args: `${serviceJs} ${flags.config}`,
            interpreter: 'node',
          },
          (err, _apps) => {
            if (err) {
              console.error(err)
              return pm2.disconnect()
            }
            pm2.list((err, list) => {
              if (err) {
                console.error(err)
                return pm2.disconnect()
              }
              const res = list.filter((item) => (item.name === 'rest' ? true : false))
              const logger = new Logger('rest')
              if (res[0].pm2_env?.status?.toString() !== 'online') {
                logger.error('Startup failed. Please check the log.')
                logger.shutdown(-1)
                return pm2.disconnect()
              }
              logger.info('REST server is started.')
              return pm2.disconnect()
            })
          }
        )
      } else if (args.cmd === 'stop') {
        pm2.stop('rest', (err, proc) => {
          if (err) {
            console.error(err)
            return pm2.disconnect()
          }
          pm2.list((err, list) => {
            if (err) {
              console.error(err)
              return pm2.disconnect()
            }
            const res = list.filter((item) => (item.name === 'rest' ? true : false))
            const logger = new Logger('rest')
            if (res[0].pm2_env?.status?.toString() !== 'stopped') {
              logger.error('Stop failed. Please check the log.')
              return pm2.disconnect()
            }
            logger.info('REST server is stopped.')
            return pm2.disconnect()
          })
        })
      } else if (args.cmd === 'status') {
        pm2.list((err, list) => {
          const res = list.filter((item) => (item.name === 'rest' ? true : false))
          const logger = new Logger('rest')
          if (res[0].pm2_env?.status?.toString() !== 'online') {
            logger.info('REST server is stopped.')
          } else {
            logger.info('REST server is started.')
          }
          return pm2.disconnect()
        })
      }
    })
  }
}
