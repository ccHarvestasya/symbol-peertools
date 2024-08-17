import { IncomingMessage, ServerResponse } from 'node:http'
import { Catapult } from '../catapult/Catapult.js'
import { Logger } from '../logger.js'

export abstract class RestBase {
  async response(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    catapult: Catapult
  ) {
    const logger = new Logger('rest')
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

    try {
      switch (request.method) {
        case 'GET': {
          await this.responseGet(request, response, catapult)
          break
        }

        case 'POST': {
          await this.responsePost(request, response, catapult)
          break
        }

        case 'PUT': {
          await this.responsePut(request, response, catapult)
          break
        }

        default: {
          break
        }
      }
    } catch (error) {
      const msg = (error as Error).message
      logger.error(`${ip} 500 ${request.url} ${msg}`)
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(`{"code":"InternalError","message":"${msg}"}`)
    }
  }

  protected abstract responseGet(
    _request: IncomingMessage,
    _response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    _catapult: Catapult
  ): Promise<void>

  protected abstract responsePost(
    _request: IncomingMessage,
    _response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    _catapult: Catapult
  ): Promise<void>

  protected abstract responsePut(
    _request: IncomingMessage,
    _response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    _catapult: Catapult
  ): Promise<void>
}
