import { Command, Flags } from '@oclif/core'
import { SimpleSymbolNodeCert } from 'simple-symbol-node-cert'

export default class Generate extends Command {
  static description = 'Display Symbol node certificate information.'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  static flags = {
    certdir: Flags.string({
      default: './cert',
      description: 'Certificate directory',
      required: false,
    }),
    networkId: Flags.string({
      char: 'n',
      default: 'mainnet',
      description: 'network ID(mainnet/testnet/any number)',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Generate)
    const ssnc = new SimpleSymbolNodeCert()
    ssnc.info(flags.networkId, flags.certdir)
  }
}
