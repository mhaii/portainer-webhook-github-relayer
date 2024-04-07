import { Application } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as process from 'process'

import Log from '../middlewares/Log'

class Locals {
  public static configs = Locals.loadConfigs()

  private static loadConfigs() {
    dotenv.config({ path: path.join(__dirname, '../../.env') })

    const apiPrefix = Locals.tryLoadEnv('API_PREFIX', true) || ''
    const port = +Locals.tryLoadEnv('PORT', true) || 4040

    const url = Locals.tryLoadEnv('APP_URL', true) || `http://0.0.0.0:${port}/${apiPrefix}`

    const portainerHost = Locals.tryLoadEnv('PORTAINER_HOST')
    const portainerApiKey = Locals.tryLoadEnv('PORTAINER_API_TOKEN')

    const githubWebhookSecret = Locals.tryLoadEnv('GITHUB_WEBHOOK_SECRET', true)

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
    _express.locals.app = this.configs
    return _express
  }

  private static tryLoadEnv(envName: string, optional = false): string | undefined {
    const envFileValue = process.env[envName + '_FILE']
    if (envFileValue) {
      try {
        const fileSecret = fs.readFileSync(envFileValue).toString()
        Log.info(`Loaded [${envName}] from file`)
        return fileSecret
      } catch (e) {
        const errorMsg = `Error loading [${envName}] from file`
        if (optional) {
          Log.info(errorMsg)
        } else {
          Log.error(errorMsg)
          throw new Error(errorMsg)
        }
      }
    }
    const envValue = process.env[envName]
    if (envValue) {
      Log.info(`Loaded [${envName}] from env`)
    } else {
      const errorMsg = `Error loading [${envName}] from env`
      if (optional) {
        Log.info(errorMsg)
      } else {
        Log.error(errorMsg)
        throw new Error(errorMsg)
      }
    }
    return envValue
  }
}

export default Locals
