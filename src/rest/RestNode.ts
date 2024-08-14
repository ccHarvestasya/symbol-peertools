import { IncomingMessage, ServerResponse } from 'node:http'
import { Catapult } from '../catapult/Catapult.js'
import { Logger } from '../logger.js'

export class RestNode {
  async response(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    catapult: Catapult
  ) {
    const logger = new Logger('rest')
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

    switch (request.method) {
      case 'GET':
        await this.responseGet(request, response, catapult)
        break
      case 'POST':
        // 処理無し
        break
      case 'PUT':
        // 処理無し
        break
      default:
        // 処理無し
        break
    }
  }

  private async responseGet(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    catapult: Catapult
  ) {
    const logger = new Logger('rest')
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

    try {
      let result: any
      switch (request.url) {
        case '/node/info':
          logger.info(`${ip} 200 ${request.url}`)
          result = await catapult.getNodeInfo()
          if (result === undefined) throw Error('Internal Server Error')
          response.writeHead(200, { 'Content-Type': 'application/json' })
          response.end(JSON.stringify(result))
          break
        case '/node/peers':
          logger.info(`${ip} 200 ${request.url}`)
          result = await catapult.getNodePeers()
          if (result === undefined) throw Error('Internal Server Error')
          response.writeHead(200, { 'Content-Type': 'application/json' })
          response.end(JSON.stringify(result))
          break
        case '/node/unlockedaccount':
          logger.info(`${ip} 200 ${request.url}`)
          result = await catapult.getNodeUnlockedAccount()
          if (result === undefined) throw Error('Internal Server Error')
          response.writeHead(200, { 'Content-Type': 'application/json' })
          response.end(JSON.stringify(result))
          break
        case '/node/time':
          logger.info(`${ip} 200 ${request.url}`)
          result = await catapult.getNodeTime()
          if (result === undefined) throw Error('Internal Server Error')
          response.writeHead(200, { 'Content-Type': 'application/json' })
          response.end(JSON.stringify(result))
          break
        case '/node/diagnosticcounters':
          logger.info(`${ip} 200 ${request.url}`)
          result = await catapult.getDiagnosticCounters()
          if (result === undefined) throw Error('Internal Server Error')
          response.writeHead(200, { 'Content-Type': 'application/json' })
          const diagnosticCounters = new Map<string, number>()
          for (const res of result) diagnosticCounters.set(res.itemName.trim(), Number.parseInt(res.itemValue))
          response.end(JSON.stringify({ diagnosticCounters: Object.fromEntries(diagnosticCounters) }))
          break
        case '/node/health':
        case '/node/storage':
        case '/node/server':
        default:
          // 処理無し
          break
      }
    } catch {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    }
  }

  private async responsePost(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    catapult: Catapult
  ) {}

  private async responsePut(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    catapult: Catapult
  ) {}
  // end
}
