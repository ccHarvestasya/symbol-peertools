import { IncomingMessage, ServerResponse } from 'node:http'
import { Catapult } from '../catapult/Catapult.js'
import { Logger } from '../logger.js'

export class RestChain {
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
        case '/chain/info':
          logger.info(`${ip} 200 ${request.url}`)
          result = await catapult.getChainInfo()
          if (result === undefined) throw Error('Internal Server Error')
          response.writeHead(200, { 'Content-Type': 'application/json' })
          response.end(JSON.stringify(result))
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
