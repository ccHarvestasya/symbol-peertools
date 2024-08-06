import { Catpult } from '@/catapult/Catpult.js'
import { Logger } from '@/logger.js'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { join } from 'node:path'

/** ロガー */
const logger = new Logger('rest')

/** コマンドライン引数 */
const args = process.argv.slice(2)

/** コマンドライン引数 */
// コマンド
const command = args[0]
if (command !== 'start' && command !== 'stop') {
  const msg = 'unknown command.'
  logger.error(msg)
  throw new Error(msg)
}

// ポート
const port = args[1] ?? '3000'
if (Number.isNaN(port)) {
  const msg = 'port is not numeric.'
  logger.error(msg)
  throw new TypeError(msg)
}

/** ファイルパス */
const wkDir = process.cwd()
const pidFilePath = join(wkDir, 'rest.pid')

/** Catapult */
const catpult = new Catpult('sakia.harvestasya.com')

/** サーバ設定 */
const server = createServer(async (request, response) => {
  const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

  if (request.url === '/chain/info') {
    logger.info(`${ip} 200 ${request.url}`)
    const result = await catpult.getChainInfo()
    if (result === undefined) {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(result))
    }
  } else if (request.url === '/node/info') {
    logger.info(`${ip} 200 ${request.url}`)
    const result = await catpult.getNodeInfo()
    if (result === undefined) {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(result))
    }
  } else if (request.url === '/node/peers') {
    logger.info(`${ip} 200 ${request.url}`)
    const result = await catpult.getNodePeers()
    if (result === undefined) {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(result))
    }
  } else if (request.url === '/node/unlockedaccount') {
    logger.info(`${ip} 200 ${request.url}`)
    const result = await catpult.getNodeUnlockedAccount()
    if (result === undefined) {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(result))
    }
  } else if (request.url === '/node/time') {
    logger.info(`${ip} 200 ${request.url}`)
    const result = await catpult.getNodeTime()
    if (result === undefined) {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(result))
    }
  } else if (request.url === '/node/diagnosticcounters') {
    logger.info(`${ip} 200 ${request.url}`)
    const result = await catpult.getDiagnosticCounters()
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
    server.listen(port)
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
