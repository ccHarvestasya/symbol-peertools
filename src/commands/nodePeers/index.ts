import { Command, Flags } from '@oclif/core'
import { Catapult } from '../../catapult/Catapult.js'

export default class NodePeers extends Command {
  static description = 'Display the same results as /node/peers for API nodes.'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  static flags = {
    port: Flags.integer({
      char: 'p',
      default: 7900,
      description: 'Port of symbol node to be accessed.',
      required: false,
    }),
    host: Flags.string({
      char: 'h',
      default: '127.0.0.1',
      description: 'Host of Symbol node to access.',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(NodePeers)
    const catapult = new Catapult(flags.host, flags.port)
    const result = await catapult.getNodePeers()
    console.log(JSON.stringify(result, null, 2))
  }
}
