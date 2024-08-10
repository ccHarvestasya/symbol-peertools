import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
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
// コマンド
const command = args[0]
if (command !== 'start' && command !== 'stop') {
  logger.error('unknown command.')
  logger.shutdown(-1)
}
// コンフィグファイル
const configFilePath = args[1]

/** ファイルパス */
const wkDir = process.cwd()
const pidFilePath = join(wkDir, '.watcher.pid')

/** Catapultチェック */
try {
  const config = ConfigMgr.loadConfig(configFilePath)
  new Catapult(config.certPath, '127.0.0.1', config.peerPort)
} catch (e) {
  logger.fatal(e as string)
  logger.shutdown(-1)
}

/** サーバ開始&終了 */
if (command === 'start') {
  if (existsSync(pidFilePath)) {
    logger.info('Watcher service has already started.')
  } else {
    writeFileSync(pidFilePath, process.pid.toString())
    logger.info('Watcher service started.')
    try {
      const config = ConfigMgr.loadConfig(configFilePath)
      if (!config.watcher) throw Error('Symbol node watcher config not set')
      const nw = new NodeWatch(config)
      cron.schedule(config.watcher!.cronExpression, () => {
        nw.start()
      })
    } catch (e) {
      logger.fatal(e as string)
      logger.shutdown(-1)
    }
  }
} else if (command === 'stop') {
  if (existsSync(pidFilePath)) {
    const pid = Number.parseInt(readFileSync(pidFilePath, 'utf8').trim(), 10)
    logger.debug(`kill pid: ${pid}`)
    process.kill(pid)
    unlinkSync(pidFilePath)
    logger.info('Watcher service stoped.')
  } else {
    logger.info('Watcher service is stopped.')
  }
}
