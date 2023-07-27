import { Application } from 'express'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as process from 'process'

class Locals {
  public static config(): any {
    dotenv.config({ path: path.join(__dirname, '../../.env') })

    const url = process.env.APP_URL || `http://0.0.0.0:${process.env.PORT}`
    const port = process.env.PORT || 4040

    const apiPrefix = process.env.API_PREFIX || ''

    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 3

    return {
      apiPrefix,
      jwtExpiresIn,
      port,
      url,
    }
  }

  public static init(_express: Application): Application {
    _express.locals.app = this.config()
    return _express
  }
}

export default Locals
