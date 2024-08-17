import { IncomingMessage, ServerResponse } from 'node:http'
import { Catapult } from '../catapult/Catapult.js'
import { Logger } from '../logger.js'
import { RestBase } from './RestBase.js'

export class RestChain extends RestBase {
  protected async responseGet(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    catapult: Catapult
  ) {
    const logger = new Logger('rest')
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

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
