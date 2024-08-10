import { Command, Flags } from '@oclif/core'
import { Catapult } from '../../catapult/Catapult.js'
import { ConfigMgr } from '../../ConfigMgr.js'

export default class NodeInfo extends Command {
  static description = 'Display the same results as /node/info for API nodes.'

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
    configFilePath: Flags.string({
      char: 'c',
      default: './config.json',
      description: 'Config file path.',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(NodeInfo)

    const config = ConfigMgr.loadConfig(flags.configFilePath)
    const catapult = new Catapult(config.certPath, flags.host, flags.port)
    const result = await catapult.getNodeInfo()
    console.log(JSON.stringify(result, null, 2))
  }
}
