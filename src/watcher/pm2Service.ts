import { Catapult } from '../catapult/Catapult.js'
import { Logger } from '../logger.js'
import { ConfigMgr } from '../ConfigMgr.js'
import { NodeWatch } from './NodeWatch.js'
import cron from 'node-cron'

/** ロガー */
const logger = new Logger('watcher')

/** コマンドライン引数 */
const args = process.argv.slice(2)

/** コマンドライン引数 */
// コンフィグファイル
const configFilePath = args[0]
logger.debug(`argConfigFilePath: ${configFilePath}`)

try {
  /** コンフィグファイル */
  const config = ConfigMgr.loadConfig(configFilePath)

  /** Catapultチェック */
  const host = config.isDebug ? 'sakia.harvestasya.com' : '127.0.0.1'
  logger.debug(`Catapult Server Connection Host: ${host}`)
  // eslint-disable-next-line no-new
  new Catapult(config.certPath, host, config.peerPort)

  /** サーバ開始 */
  if (!config.watcher) throw new Error('Symbol node watcher config not set')
  logger.debug('Watcher service started.')
  const nodeWatch = new NodeWatch(config)
  cron.schedule(config.watcher!.cronExpression, () => {
    nodeWatch.start()
  })
} catch (error) {
  logger.error(error as string)
  logger.shutdown(-1)
}
