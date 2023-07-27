import { Application } from 'express'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as process from 'process'

class Locals {
  public static config() {
    dotenv.config({ path: path.join(__dirname, '../../.env') })

    const apiPrefix = process.env.API_PREFIX || ''

    const url = process.env.APP_URL || `http://0.0.0.0:${process.env.PORT}/${apiPrefix}`
    const port = +process.env.PORT || 4040

    const portainerHost = process.env.PORTAINER_HOST
    const portainerApiKey = process.env.PORTAINER_API_TOKEN

    const githubWebhookSecret = process.env.WEBHOOK_SECRET

    return {
      apiPrefix,
      port,
      url,
      portainerHost,
      portainerApiKey,
      githubWebhookSecret,
    }
  }

  public static init(_express: Application): Application {
    _express.locals.app = this.config()
    return _express
  }
}

export default Locals
