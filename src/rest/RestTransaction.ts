import { IncomingMessage, ServerResponse } from 'node:http'
import { Catapult } from '../catapult/Catapult.js'
import { Logger } from '../logger.js'
import { RestBase } from './RestBase.js'

export class RestTransaction extends RestBase {
  protected async responseGet(
    _request: IncomingMessage,
    _response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    _catapult: Catapult
  ) {}

  protected async responsePost(
    _request: IncomingMessage,
    _response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    _catapult: Catapult
  ) {}

  protected async responsePut(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    catapult: Catapult
  ) {
    const logger = new Logger('rest')
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

    const payload = await new Promise<string>((resolve) => {
      let data = ''
      request
        .on('data', (chunk) => {
          data += chunk
        })
        .on('end', () => {
          resolve(data)
        })
    })
    logger.debug(payload)
    const payloadJson = JSON.parse(payload)

    switch (request.url) {
      case '/transactions': {
        if (payloadJson.payload === undefined || payloadJson.payload === '') throw new Error(`payload is empty.`)
        const announceTxResult = await catapult.announceTx(payloadJson.payload)
        if (!announceTxResult) throw new Error('Internal error has occurred.')
        logger.info(`${ip} 202 ${request.url}`)
        response.writeHead(202, { 'Content-Type': 'application/json' })
        response.end(`{"message":"packet 9 was pushed to the network via ${request.url}"}`)
        break
      }

      default: {
        // 処理無し
        break
      }
    }
  }
}
