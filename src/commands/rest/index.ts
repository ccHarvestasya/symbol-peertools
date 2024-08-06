import { Args, Command, Flags } from '@oclif/core'
import { exec } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Logger } from '../../logger.js'

export default class Rest extends Command {
  static args = {
    cmd: Args.string({ description: 'REST Server Start or Stop', required: true }),
  }

  static description = 'REST for Peer Node'

  static examples = [
    `<%= config.bin %> <%= command.id %> start`,
    `<%= config.bin %> <%= command.id %> start -p 3001`,
    `<%= config.bin %> <%= command.id %> stop`,
  ]

  static flags = {
    port: Flags.integer({ char: 'p', default: 3000, description: 'listen port', required: false }),
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Rest)

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(dirname(dirname(dirname(__filename))))
    const restserverSh = join(__dirname, 'sh/restserver.sh')

    const logger = new Logger('rest')
    logger.info(`${restserverSh} ${args.cmd} ${flags.port}`)
    exec(`${restserverSh} ${args.cmd} ${flags.port}`)
  }
}
