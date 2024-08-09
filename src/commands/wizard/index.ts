import { Command } from '@oclif/core'
import { confirm, input, password } from '@inquirer/prompts'
import { existsSync } from 'fs'
import { SimpleSymbolNodeCert } from 'simple-symbol-node-cert'

export default class Wizard extends Command {
  static description = 'Wizard for generating Symbol certificate.'

  static examples = [`<%= config.bin %> <%= command.id %> wizard`]

  async run(): Promise<void> {
    const certDirPath = './cert'
    let isOverwrite = false
    if (existsSync(certDirPath)) {
      isOverwrite = await confirm({
        message: `Overwrite?`,
      })
      if (!isOverwrite) process.exit(0)
    }
    const caName = await input({ message: 'CA name: ', default: 'Simple Symbol CA' })
    const caDaysString = await input({
      message: 'CA certificate days: ',
      default: '7300',
      validate: (input) => {
        if (isNaN(Number(input))) return false
        return true
      },
    })
    const caDays = Number(caDaysString)
    const nodeName = await input({ message: 'Node name: ', default: 'Simple Symbol Node' })
    const nodeDaysString = await input({
      message: 'Node certificate days: ',
      default: '375',
      validate: (input) => {
        if (isNaN(Number(input))) return false
        return true
      },
    })
    const nodeDays = Number(nodeDaysString)
    const privatekeysFilePath = await input({
      message: 'Encrypted privatekeys file save path: ',
      default: './privatekeys.yaml',
    })
    const passwd = await password({ message: 'Privatekeys encryption password: ', mask: true })

    const ssnc = new SimpleSymbolNodeCert()
    ssnc.generate(certDirPath, caName, nodeName, caDays, nodeDays, isOverwrite, privatekeysFilePath, passwd)
  }
}
