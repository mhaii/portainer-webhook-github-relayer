import * as express from 'express'

import Locals from './Locals'
import Routes from './Routes'
import Bootstrap from '../middlewares/Kernel'
import ExceptionHandler from '../exception/Handler'

class Express {
  public express: express.Application

  constructor() {
    this.express = express()

    this.mountDotEnv()
    this.mountMiddlewares()
    this.mountRoutes()
  }

  private mountDotEnv(): void {
    this.express = Locals.init(this.express)
  }
  private mountMiddlewares(): void {
    this.express = Bootstrap.init(this.express)
  }
  private mountRoutes(): void {
    this.express = Routes.mountApi(this.express)
  }
  public init(): any {
    const port: number = Locals.config().port

    // Registering Exception / Error Handlers
    this.express.use(ExceptionHandler.logErrors)
    this.express.use(ExceptionHandler.clientErrorHandler)
    this.express.use(ExceptionHandler.errorHandler)
    this.express = ExceptionHandler.notFoundHandler(this.express)

    // Start the server on the specified port
    this.express.listen(port, () => {
      return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://0.0.0.0:${port}'`)
    }).on('error', (_error) => {
      return console.log('Error: ', _error.message)
    })
  }
}

export default new Express()
