import { Command, Flags } from '@oclif/core'
import { confirm, input, number, password } from '@inquirer/prompts'
import { existsSync } from 'node:fs'
import { SimpleSymbolNodeCert } from 'simple-symbol-node-cert'
import { Config, ConfigMgr, Watcher } from '../../ConfigMgr.js'
import figlet from 'figlet'

export default class Wizard extends Command {
  static description = 'Wizard for generating Symbol certificate.'

  static examples = [`<%= config.bin %> <%= command.id %> wizard`]

  static flags = {
    configFilePath: Flags.string({
      char: 'c',
      default: './config.json',
      description: 'Config file path.',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Wizard)

    console.log(figlet.textSync('symbol-peertools', { horizontalLayout: 'fitted' }))

    // Configデフォ値
    const configWatcherDef: Watcher = {
      nodePath: '',
      discordWebhookUrl: '',
      cronExpression: '0 0 * * * *',
      symbolStatisticServiceUrl: 'https://symbol.services/nodes?filter=suggested&limit=5',
      differenceChainHeight: 10,
      differenceFinHeight: 100,
      stopCommand: 'symbol-bootstrap stop',
      runCommand: 'symbol-bootstrap run -d',
      isPeerCheck: true,
    }

    /** Configファイル読み込み */
    let config: Config | undefined
    try {
      config = ConfigMgr.loadConfig(flags.configFilePath)
    } catch {
      // 読めなかったらデフォルト値
      config = {
        certPath: './cert',
        peerPort: 7900,
        restPort: 3000,
        watcher: configWatcherDef,
      }
    }

    if (!config.watcher) {
      config.watcher = configWatcherDef
    }

    /** 対話 */
    const certDirPath = await input({ message: 'Certificate output directory:', default: config.certPath })
    let isOverwrite = false
    if (existsSync(certDirPath)) {
      isOverwrite = await confirm({
        message: `Overwrite?`,
      })
      if (!isOverwrite) throw new Error(`Exit because the file already exists.`)
    }

    const peerPort = await number({ message: 'Peer port:', default: config.peerPort })
    const restPort = await number({ message: 'REST port:', default: config.restPort })
    const caName = await input({ message: 'CA name:', default: 'Simple Symbol CA' })
    const caDays = await number({ message: 'CA certificate days:', default: 7300 })
    const nodeName = await input({ message: 'Node name:', default: 'Simple Symbol Node' })
    const nodeDays = await number({ message: 'Node certificate days:', default: 375 })
    const privatekeysFilePath = await input({
      message: 'Encrypted privatekeys file save path:',
      default: './privatekeys.yaml',
    })
    const passwd = await password({
      message: 'Privatekeys encryption password:',
      mask: true,
      validate(value) {
        if (value === '') return false
        return true
      },
    })

    let newConfigWatcher: Watcher | undefined
    const isWatch = await confirm({ message: 'Do you monitor Symbol Peer nodes?:', default: false })
    if (isWatch) {
      const nodeDirPath = await input({
        message: 'Symbol node installed directory:',
        default: config.watcher?.nodePath,
      })
      const discordWebhookUrl = await input({
        message: 'Discord webhook URL for notification:',
        default: config.watcher?.discordWebhookUrl,
      })
      const cronExpression = await input({ message: 'Cron expression:', default: config.watcher?.cronExpression })
      const symbolStatisticServiceUrl = await input({
        message: 'Symbol Statistic Service URL:',
        default: config.watcher?.symbolStatisticServiceUrl,
      })
      const differenceChainHeight = await number({
        message: 'Difference chain height:',
        default: config.watcher?.differenceChainHeight,
      })
      const differenceFinHeight = await number({
        message: 'Difference finalized height:',
        default: config.watcher?.differenceFinHeight,
      })
      const stopCommand = await input({ message: 'Symbol node stop command:', default: config.watcher?.stopCommand })
      const runCommand = await input({ message: 'Symbol node start command:', default: config.watcher?.runCommand })
      // const isPeerCheck = await confirm({ message: 'Peer check?:', default: config.watcher?.isPeerCheck })
      const isPeerCheck = true

      newConfigWatcher = {
        nodePath: nodeDirPath,
        discordWebhookUrl,
        cronExpression,
        symbolStatisticServiceUrl,
        differenceChainHeight: differenceChainHeight!,
        differenceFinHeight: differenceFinHeight!,
        stopCommand,
        runCommand,
        isPeerCheck,
      }
    }

    const ssnc = new SimpleSymbolNodeCert()
    ssnc.generate(certDirPath, caName, nodeName, caDays, nodeDays, isOverwrite, privatekeysFilePath, passwd)

    try {
      const newConfig: Config = {
        certPath: certDirPath,
        peerPort,
        restPort,
        watcher: newConfigWatcher,
      }
      ConfigMgr.saveConfig(newConfig, flags.configFilePath)
    } catch (error) {
      console.error(error)
    }
  }
}
