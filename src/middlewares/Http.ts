import { Application } from 'express'
import * as compress from 'compression'
import * as bodyParser from 'body-parser'
import * as expressValidator from 'express-validator'

import Log from './Log'
import Locals from '../providers/Locals'
import * as Crypto from 'crypto'

class Http {
  public static mount(_express: Application): Application {
    Log.info('Booting the \'HTTP\' middleware...')

    // Enables the request body parser
    _express.use(bodyParser.json())

    _express.use(bodyParser.urlencoded({
      extended: false,
    }))

    // Disable the x-powered-by header in response
    _express.disable('x-powered-by')

    // Enables the request payload validator
    _express.use(expressValidator())

    const webhookSecret = Locals.configs.githubWebhookSecret
    if (webhookSecret) {
      _express.use((req, res, next) => {

        const isValid = Http.validateWebhook(
          webhookSecret,
          req.body,
          req.headers['x-hub-signature-256'] as string,
        )

        return isValid
          ? next()
          : res.status(401).send({ error: 'Unauthorized' })
      })
    }

    // Enables the "gzip" / "deflate" compression for response
    _express.use(compress())

    return _express
  }

  static validateWebhook(secret: string, body: any, signature: string): boolean {
    const digest = Crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex')

    return `sha256=${digest}` === signature
  }
}

export default Http
