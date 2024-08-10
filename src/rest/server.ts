import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { Catapult } from '../catapult/Catapult.js'
import { Logger } from '../logger.js'
import { ConfigMgr } from '../ConfigMgr.js'

/** ロガー */
const logger = new Logger('rest')

/** コマンドライン引数 */
const args = process.argv.slice(2)

/** コマンドライン引数 */
// コマンド
const command = args[0]
if (command !== 'start' && command !== 'stop') {
  logger.error('unknown command.')
  logger.shutdown(-1)
}
// ポート
const port = args[1] ?? '3000'
if (isNaN(Number(port))) {
  logger.error('port is not numeric.')
  logger.shutdown(-1)
}
// コンフィグファイル
const configFilePath = args[2]

/** ファイルパス */
const wkDir = process.cwd()
const pidFilePath = join(wkDir, 'rest.pid')

/** Catapult */
let catapult: Catapult
try {
  const config = ConfigMgr.loadConfig(configFilePath)
  catapult = new Catapult(config.certPath, 'sakia.harvestasya.com', config.peerPort)
} catch (e) {
  logger.fatal(e as string)
  logger.shutdown(-1)
}

/** サーバ設定 */
const server = createServer(async (request, response) => {
  const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

  if (request.url === '/chain/info') {
    logger.info(`${ip} 200 ${request.url}`)
    const result = await catapult.getChainInfo()
    if (result === undefined) {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(result))
    }
  } else if (request.url === '/node/info') {
    logger.info(`${ip} 200 ${request.url}`)
    const result = await catapult.getNodeInfo()
    if (result === undefined) {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(result))
    }
  } else if (request.url === '/node/peers') {
    logger.info(`${ip} 200 ${request.url}`)
    const result = await catapult.getNodePeers()
    if (result === undefined) {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(result))
    }
  } else if (request.url === '/node/unlockedaccount') {
    logger.info(`${ip} 200 ${request.url}`)
    const result = await catapult.getNodeUnlockedAccount()
    if (result === undefined) {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(result))
    }
  } else if (request.url === '/node/time') {
    logger.info(`${ip} 200 ${request.url}`)
    const result = await catapult.getNodeTime()
    if (result === undefined) {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(result))
    }
  } else if (request.url === '/node/diagnosticcounters') {
    logger.info(`${ip} 200 ${request.url}`)
    const result = await catapult.getDiagnosticCounters()
    if (result === undefined) {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      const diagnosticCounters = new Map<string, number>()
      for (const res of result) {
        diagnosticCounters.set(res.itemName.trim(), Number.parseInt(res.itemValue))
      }
      response.end(JSON.stringify({ diagnosticCounters: Object.fromEntries(diagnosticCounters) }))
    }
  } else {
    logger.error(`${ip} 404 ${request.url}`)
    response.writeHead(404, { 'Content-Type': 'application/json' })
    response.end(`{"code":"ResourceNotFound","message":"${request.url} does not exist"}`)
  }
})

/** サーバ開始&終了 */
if (command === 'start') {
  if (existsSync(pidFilePath)) {
    logger.info('REST server has already started.')
  } else {
    writeFileSync(pidFilePath, process.pid.toString())
    logger.info('REST server started.')
    try {
      server.listen(port)
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
    logger.info('REST server stoped.')
  } else {
    logger.info('REST server is stopped.')
  }
}
