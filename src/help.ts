import { Command, Help } from '@oclif/core'
import figlet from 'figlet'

export default class MyHelpClass extends Help {
  async showRootHelp() {
    console.log(figlet.textSync('symbol-peertools', { horizontalLayout: 'fitted' }))

    let rootTopics = this.sortedTopics
    let rootCommands = this.sortedCommands

    const state = this.config.pjson?.oclif?.state
    if (state) {
      this.log(state === 'deprecated' ? `${this.config.bin} is deprecated` : `${this.config.bin} is in ${state}.\n`)
    }

    this.log(this.formatRoot())
    this.log('')

    if (!this.opts.all) {
      rootTopics = rootTopics.filter((t) => !t.name.includes(':'))
      rootCommands = rootCommands.filter((c) => !c.id.includes(':'))
    }

    if (rootTopics.length > 0) {
      this.log(this.formatTopics(rootTopics))
      this.log('')
    }

    if (rootCommands.length > 0) {
      rootCommands = rootCommands.filter((c) => c.id)
      this.log(this.formatCommands(rootCommands))
      this.log('')
    }
  }

  async showCommandHelp(command: Command.Loadable) {
    console.log(figlet.textSync('symbol-peertools', { horizontalLayout: 'fitted' }))

    const name = command.id
    const depth = name.split(':').length

    const subTopics = this.sortedTopics.filter(
      (t) => t.name.startsWith(name + ':') && t.name.split(':').length === depth + 1
    )
    const subCommands = this.sortedCommands.filter(
      (c) => c.id.startsWith(name + ':') && c.id.split(':').length === depth + 1
    )
    // const plugin = this.config.plugins.get(command.pluginName!)

    // const state = this.config.pjson?.oclif?.state || plugin?.pjson?.oclif?.state || command.state

    // if (state) {
    //   this.log(
    //     state === 'deprecated'
    //       ? `${formatCommandDeprecationWarning(toConfiguredId(name, this.config), command.deprecationOptions)}\n`
    //       : `This command is in ${state}.\n`
    //   )
    // }

    // if (command.deprecateAliases && command.aliases.includes(name)) {
    //   const actualCmd = this.config.commands.find((c) => c.aliases.includes(name))
    //   const opts = { ...command.deprecationOptions, ...(actualCmd ? { to: actualCmd.id } : {}) }
    //   this.log(`${formatCommandDeprecationWarning(toConfiguredId(name, this.config), opts)}\n`)
    // }

    const summary = this.summary(command)
    if (summary) {
      this.log(summary + '\n')
    }

    this.log(this.formatCommand(command))
    this.log('')

    if (subTopics.length > 0) {
      this.log(this.formatTopics(subTopics))
      this.log('')
    }

    if (subCommands.length > 0) {
      const aliases: string[] = []
      const uniqueSubCommands: Command.Loadable[] = subCommands.filter((p) => {
        aliases.push(...p.aliases)
        return !aliases.includes(p.id)
      })
      this.log(this.formatCommands(uniqueSubCommands))
      this.log('')
    }
  }
}
