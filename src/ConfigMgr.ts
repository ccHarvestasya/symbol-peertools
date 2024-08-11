import { readFileSync, writeFileSync } from 'node:fs'

export interface Config {
  certPath: string
  peerPort?: number
  isDebug?: boolean
  watcher?: Watcher
}

export interface Watcher {
  nodePath: string
  discordWebhookUrl: string
  cronExpression: string
  symbolStatisticServiceUrl: string
  differenceChainHeight: number
  differenceFinHeight: number
  stopCommand: string
  runCommand: string
  isPeerCheck: boolean
}

export class ConfigMgr {
  static loadConfig(configFilePath?: string): Config {
    try {
      const configJson = readFileSync(configFilePath ?? './config.json', { encoding: 'utf-8' })
      const config: Config = JSON.parse(configJson)

      if (config.certPath == '' || config.certPath == undefined) throw new Error('not find cert path')

      config.peerPort ?? 7900

      return JSON.parse(configJson)
    } catch (error) {
      throw new Error('Error loading config file')
    }
  }

  static saveConfig(config: Config, configFilePath?: string): void {
    try {
      const configJson = JSON.stringify(config, null, 2)
      writeFileSync(configFilePath ?? './config.json', configJson, { encoding: 'utf-8' })
    } catch (error) {
      throw new Error('Error saveing config file')
    }
  }
}
