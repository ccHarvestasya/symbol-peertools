import password from '@inquirer/password'
import { Command, Flags } from '@oclif/core'
import { SimpleSymbolNodeCert } from 'simple-symbol-node-cert'

export default class Generate extends Command {
  static description = 'Create Symbol node certificate.'

  static examples = [`<%= config.bin %> <%= command.id %> --caname "Test CA" --nodename "Test Node"`]

  static flags = {
    cadays: Flags.integer({
      default: 7300,
      description: 'CA certificate days',
      required: false,
    }),
    caname: Flags.string({
      default: 'Simple Symbol CA',
      description: 'CA Name',
      required: false,
    }),
    certdir: Flags.string({
      default: './cert',
      description: 'Certificate output directory',
      required: false,
    }),
    force: Flags.boolean({
      default: false,
      description: 'Overwrite certificate output directory',
      required: false,
    }),
    nodedays: Flags.integer({
      default: 375,
      description: 'Node certificate days',
      required: false,
    }),
    nodename: Flags.string({
      default: 'Simple Symbol Node',
      description: 'Node Name',
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
    const passwd = await password({ mask: true, message: 'Privatekeys encryption password:' })
    const ssnc = new SimpleSymbolNodeCert()
    ssnc.generate(
      flags.certdir,
      flags.caname,
      flags.nodename,
      flags.cadays,
      flags.nodedays,
      flags.force,
      flags.privatekeys,
      passwd
    )
  }
}
