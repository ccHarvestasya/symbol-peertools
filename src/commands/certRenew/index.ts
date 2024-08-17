import { password } from '@inquirer/prompts'
import { Command, Flags } from '@oclif/core'
import { SimpleSymbolNodeCert } from 'simple-symbol-node-cert'

export default class Generate extends Command {
  static description = 'Renew Symbol node certificate.'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  static flags = {
    cadays: Flags.integer({
      default: 7300,
      description: 'CA certificate days',
      required: false,
    }),
    certdir: Flags.string({
      default: './cert',
      description: 'Certificate directory',
      required: false,
    }),
    nodedays: Flags.integer({
      default: 375,
      description: 'Node certificate days',
      required: false,
    }),
    privatekeys: Flags.string({
      default: './privatekeys.yaml',
      description: 'Encrypted privatekeys file save path',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Generate)
    const passwd = await password({ mask: true, message: 'enter password:' })
    const ssnc = new SimpleSymbolNodeCert()
    ssnc.renew(flags.certdir, flags.cadays, flags.nodedays, flags.privatekeys, passwd)
  }
}
