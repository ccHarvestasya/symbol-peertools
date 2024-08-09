import { Help } from '@oclif/core'
import figlet from 'figlet'

export default class MyHelpClass extends Help {
  async showHelp(_argv: string[]): Promise<void> {
    console.log(figlet.textSync('symbol-peertools', { horizontalLayout: 'fitted' }))
    this.showRootHelp()
  }
}
