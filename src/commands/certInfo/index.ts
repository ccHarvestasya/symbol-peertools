import { Command, Flags } from '@oclif/core'
import { SimpleSymbolNodeCert } from 'simple-symbol-node-cert'

export default class Generate extends Command {
  static description = 'See Symbol node certificate information.'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  static flags = {
    certdir: Flags.string({
      default: './cert',
      description: 'Certificate directory',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Generate)
    const ssnc = new SimpleSymbolNodeCert()
    ssnc.info(flags.certdir)
  }
}