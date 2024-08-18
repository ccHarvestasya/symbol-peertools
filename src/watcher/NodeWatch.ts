import { exec } from 'node:child_process'
import { Config } from '../ConfigMgr.js'
import { Catapult } from '../catapult/Catapult.js'
import { Logger } from '../logger.js'

const ERROR_MESSAGES = {
  SYMBOL_SERVICE_UNABILABLE: 'symbol.servicesが正常に稼働していません',
  YOUR_NODE_IS_UNABILABLE: 'あなたのノードが正常に稼働していません',
  NODE_HEIGHT: 'ブロック高が異常です',
  NODE_FINALIZED_HEIGHT: 'ファイナライズ高が異常です',
}

type NodeInfo = {
  name: string
  height: number
  finalizedHeight: number
}

const nodesInfo: NodeInfo[] = []

export class NodeWatch {
  logger: Logger
  config: Config

  constructor(config: Config) {
    this.config = config
    this.logger = new Logger('watcher')
  }

  private sendDiscordMessage = async (content: string) => {
    if (!this.config.watcher!.discordWebhookUrl) return
    await fetch(this.config.watcher!.discordWebhookUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'symbol node wather BOT',
        content,
        // eslint-disable-next-line camelcase
        allowed_mentions: {},
      }),
    })
  }

  private sendMessage = async (content: string) => {
    await this.sendDiscordMessage(content)
  }

  private nodeReboot = () => {
    const timeoutMilliseconds = 120_000
    const command = `cd ${this.config.watcher!.nodePath} && ${this.config.watcher!.stopCommand} && ${
      this.config.watcher!.runCommand
    }`
    const childProcess = exec(command, (error, _stdout, _stderr) => {
      if (error) {
        this.sendMessage(`ノード再起動エラー: ${error}`)
        return
      }

      this.sendMessage('正常に再起動が完了しました。確認してください。')
    })

    const timeout = setTimeout(() => {
      childProcess.kill()
      this.sendMessage('ノード再起動がタイムアウトしました。')
    }, timeoutMilliseconds)

    childProcess.on('exit', () => {
      clearTimeout(timeout)
    })
  }

  private fetchJSON = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch ${url}`)
    return response.json()
  }

  start = async () => {
    this.logger.info('=== start watcher ===')

    try {
      let nodeList: unknown
      try {
        const symbolServiceResponse = await this.fetchJSON(this.config.watcher!.symbolStatisticServiceUrl)
        nodeList = symbolServiceResponse
      } catch (error: any) {
        this.sendMessage(`${ERROR_MESSAGES.SYMBOL_SERVICE_UNABILABLE}: ${error.message}`)
        this.logger.error(error.message)
      }

      if (Array.isArray(nodeList)) {
        for (const node of nodeList) {
          try {
            // eslint-disable-next-line no-await-in-loop
            const chainInfo = (await this.fetchJSON(`http://${node.host}:3000/chain/info`)) as any
            nodesInfo.push({
              name: node.host,
              height: Number(chainInfo.height),
              finalizedHeight: Number(chainInfo.latestFinalizedBlock.height),
            })
          } catch (error: any) {
            this.logger.error(`Error fetching chain info for node ${node.host}: ${error.message}`)
          }
        }
      }

      // eslint-disable-next-line unicorn/no-array-reduce
      const maxNode = nodesInfo.reduce((max, node) => (node.height > max.height ? node : max), nodesInfo[0])
      this.logger.info(`maxNodeHost            : ${maxNode.name}`)

      let yourNodeChainInfo
      if (this.config.watcher!.isPeerCheck) {
        try {
          const host = this.config.isDebug ? 'sakia.harvestasya.com' : '127.0.0.1'
          this.logger.debug(`Catapult Server Connection Host: ${host}`)
          const catapult = new Catapult(this.config.certPath, host, this.config.peerPort)
          const chainInfo = await catapult.getChainInfo()
          yourNodeChainInfo = chainInfo
        } catch (error) {
          this.logger.error((error as Error).message)
          this.sendMessage(ERROR_MESSAGES.YOUR_NODE_IS_UNABILABLE)
          this.nodeReboot()
          return
        }
      } else {
        let yourNodeChainInfoResponce
        try {
          yourNodeChainInfoResponce = await fetch(`http://localhost:3000/chain/info`)
        } catch {
          this.sendMessage(ERROR_MESSAGES.YOUR_NODE_IS_UNABILABLE)
          this.nodeReboot()
          return
        }

        if (yourNodeChainInfoResponce === undefined || !yourNodeChainInfoResponce.ok) {
          this.sendMessage(ERROR_MESSAGES.YOUR_NODE_IS_UNABILABLE)
          this.nodeReboot()
          return
        }

        yourNodeChainInfo = (await yourNodeChainInfoResponce.json()) as any
      }

      const yourNodeHeight = Number(yourNodeChainInfo.height)
      const yourNodeFinalizedHeight = Number(yourNodeChainInfo.latestFinalizedBlock.height)
      this.logger.info(`yourNodeHeight         : ${yourNodeHeight}`)
      this.logger.info(`maxNode.height         : ${maxNode.height}`)
      this.logger.info(`yourNodeFinalizedHeight: ${yourNodeFinalizedHeight}`)
      this.logger.info(`maxNode.finalizedHeight: ${maxNode.finalizedHeight}`)

      if (maxNode.height - this.config.watcher!.differenceChainHeight > yourNodeHeight) {
        const errorMessage = `${ERROR_MESSAGES.NODE_HEIGHT}\nあなたのブロック高: ${yourNodeHeight}\n正常ノードのブロック高${maxNode.height}`
        this.sendMessage(errorMessage)
        this.nodeReboot()
        return
      }

      if (maxNode.finalizedHeight - this.config.watcher!.differenceFinHeight > yourNodeFinalizedHeight) {
        const errorMessage = `${ERROR_MESSAGES.NODE_FINALIZED_HEIGHT}\nあなたのファイナライズブロック高: ${yourNodeFinalizedHeight}\n正常ノードのファイナライズブロック高${maxNode.finalizedHeight}`
        this.sendMessage(errorMessage)
        this.nodeReboot()
        return
      }
    } catch (error: any) {
      this.sendMessage(error.message)
      this.logger.error(error.message)
    }

    this.logger.info('=== e n d watcher ===')
  }
}
