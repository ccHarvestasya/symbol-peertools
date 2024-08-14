import { IncomingMessage, ServerResponse } from 'node:http'
import { Catapult } from '../catapult/Catapult.js'
import { Logger } from '../logger.js'
import path from 'node:path'

export class RestTransaction {
  async response(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    catapult: Catapult
  ) {
    const logger = new Logger('rest')
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

    switch (request.method) {
      case 'GET':
        break
      case 'POST':
        break
      case 'PUT':
        break
      default:
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
      switch (true) {
        case /\/transactions\/confirmed/.test(request.url!):
        case /\/transactions\/confirmed\/.*/.test(request.url!):
        case /\/transactions\/unconfirmed/.test(request.url!):
        case /\/transactions\/unconfirmed\/.*/.test(request.url!):
        case /\/transactions\/partial/.test(request.url!):
        case /\/transactions\/partial\/.*/.test(request.url!):
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
  ) {
    const logger = new Logger('rest')
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

    try {
      let result: any
      switch (request.url) {
        case '/transactions/confirmed':
        case '/transactions/unconfirmed':
        case '/transactions/partial':
        default:
          // 処理無し
          break
      }
    } catch {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    }
  }

  private async responsePut(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    catapult: Catapult
  ) {
    const logger = new Logger('rest')
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

    try {
      let result: any
      switch (request.url) {
        case '/transactions':
          logger.info(`${ip} 200 ${request.url}`)
          break
        case '/transactions/partial':
          logger.info(`${ip} 200 ${request.url}`)
          break
        case '/transactions/cosignature':
          logger.info(`${ip} 200 ${request.url}`)
          break
        default:
          // 処理無し
          break
      }
    } catch {
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ServerError","message":"Internal Server Error"}`)
    }
  }
  // end
}
