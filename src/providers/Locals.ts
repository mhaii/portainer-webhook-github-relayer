import {Application} from 'express'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as process from 'process'

class Locals {
  public static config() {
    dotenv.config({path: path.join(__dirname, '../../.env')})

    const apiPrefix = process.env.API_PREFIX || ''

    const url = process.env.APP_URL || `http://0.0.0.0:${process.env.PORT}/${apiPrefix}`
    const port = +process.env.PORT || 4040

    const portainerHost = process.env.PORTAINER_HOST
    const portainerApiKey = Locals.tryLoadEnvSecretFile('PORTAINER_API_TOKEN')

    const githubWebhookSecret = Locals.tryLoadEnvSecretFile('GITHUB_WEBHOOK_SECRET')

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

  private static tryLoadEnvSecretFile(envName: string): string | undefined {
    const envFileValue = process.env[envName + '_FILE']
    if (envFileValue) {
      try {
        return fs.readFileSync(envFileValue).toString()
      } catch (_) {
      }
    }
    return process.env[envName]
  }
}

export default Locals
