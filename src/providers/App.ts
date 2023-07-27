import Express from './Express'

import Log from '../middlewares/Log'

class App {
  public loadServer(): void {
    Log.info('Server :: Initializing')

    Express.init()
  }
}

export default new App
