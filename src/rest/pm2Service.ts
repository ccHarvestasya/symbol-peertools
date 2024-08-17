import { createServer } from 'node:http'
import { Catapult } from '../catapult/Catapult.js'
import { Logger } from '../logger.js'
import { ConfigMgr } from '../ConfigMgr.js'
import { RestChain } from './RestChain.js'
import { RestNode } from './RestNode.js'
import { RestTransaction } from './RestTransaction.js'

class Pm2Service {
  start() {
    /** ロガー */
    const logger = new Logger('rest')
    logger.info('================================================================================')

    /** コマンドライン引数 */
    const args = process.argv.slice(2)

    /** コマンドライン引数 */
    // コンフィグファイル
    const configFilePath = args[0]
    logger.debug(`argConfigFilePath: ${configFilePath}`)

    try {
      /** コンフィグファイル */
      const config = ConfigMgr.loadConfig(configFilePath)

      /** Catapult */
      const host = config.isDebug ? 'sakia.harvestasya.com' : '127.0.0.1'
      logger.debug(`Catapult Server Connection Host: ${host}`)
      const catapult = new Catapult(config.certPath, host, config.peerPort)

      /** サーバ設定 */
      const server = createServer(async (request, response) => {
        await new RestChain().response(request, response, catapult)
        await new RestNode().response(request, response, catapult)
        await new RestTransaction().response(request, response, catapult)

        if (!response.headersSent) {
          // ヘッダ書き込みなしは404
          const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress
          logger.error(`${ip} 404 ${request.url}`)
          response.writeHead(404, { 'Content-Type': 'application/json' })
          response.end(`{"code":"ResourceNotFound","message":"${request.url} does not exist"}`)
        }
      })

      /** サーバ開始 */
      logger.info(`Started REST service listening on port ${config.restPort}.`)
      server.listen(config.restPort)
    } catch (e) {
      logger.error(e as string)
      logger.shutdown(-1)
    }
  }
}

new Pm2Service().start()
