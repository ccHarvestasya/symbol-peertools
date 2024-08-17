import { IncomingMessage, ServerResponse } from 'node:http'
import { Catapult } from '../catapult/Catapult.js'
import { Logger } from '../logger.js'
import { RestBase } from './RestBase.js'

export class RestNode extends RestBase {
  protected async responseGet(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    catapult: Catapult
  ) {
    const logger = new Logger('rest')
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

    switch (request.url) {
      case '/node/info':
        logger.info(`${ip} 200 ${request.url}`)
        const nodeInfoResult = await catapult.getNodeInfo()
        if (nodeInfoResult === undefined) throw Error('Internal Server Error')
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(nodeInfoResult))
        break
      case '/node/peers':
        logger.info(`${ip} 200 ${request.url}`)
        const nodePeersResult = await catapult.getNodePeers()
        if (nodePeersResult === undefined) throw Error('Internal Server Error')
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(nodePeersResult))
        break
      case '/node/unlockedaccount':
        logger.info(`${ip} 200 ${request.url}`)
        const nodeUnlockedAccountResult = await catapult.getNodeUnlockedAccount()
        if (nodeUnlockedAccountResult === undefined) throw Error('Internal Server Error')
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(nodeUnlockedAccountResult))
        break
      case '/node/time':
        logger.info(`${ip} 200 ${request.url}`)
        const nodeTimeResult = await catapult.getNodeTime()
        if (nodeTimeResult === undefined) throw Error('Internal Server Error')
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(nodeTimeResult))
        break
      case '/node/diagnosticcounters':
        logger.info(`${ip} 200 ${request.url}`)
        const dcResult = await catapult.getDiagnosticCounters()
        if (dcResult === undefined) throw Error('Internal Server Error')
        response.writeHead(200, { 'Content-Type': 'application/json' })
        const diagnosticCounters = new Map<string, number>()
        for (const res of dcResult) diagnosticCounters.set(res.itemName.trim(), Number.parseInt(res.itemValue))
        response.end(JSON.stringify({ diagnosticCounters: Object.fromEntries(diagnosticCounters) }))
        break
      case '/node/health':
      case '/node/storage':
      case '/node/server':
      default:
        // 処理無し
        break
    }
  }

  protected async responsePost(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    catapult: Catapult
  ) {}

  protected async responsePut(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    catapult: Catapult
  ) {}
  // end
}
