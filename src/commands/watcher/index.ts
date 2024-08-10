import { Args, Command } from '@oclif/core'
import { exec } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export default class SymbolNodeWatcher extends Command {
  static description = 'Monitor Symbol node activity.'

  static args = {
    cmd: Args.string({ description: 'Monitor Symbol node activity Start or Stop.', required: true }),
  }

  static examples = [`<%= config.bin %> <%= command.id %> start`, `<%= config.bin %> <%= command.id %> stop`]

  async run(): Promise<void> {
    const { args } = await this.parse(SymbolNodeWatcher)

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(dirname(dirname(dirname(__filename))))
    const restserverSh = join(__dirname, 'sh/watcherservice.sh')

    exec(`sh ${restserverSh} ${args.cmd}`)
    process.exit(0)
  }
}
