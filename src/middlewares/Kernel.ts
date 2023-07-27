import { Application } from 'express'

import Http from './Http'

import Portainer from '../providers/Portainer'

class Kernel {
  public static init(_express: Application): Application {
    // Mount basic express apis middleware
    _express = Http.mount(_express)

    Portainer.init()

    return _express
  }
}

export default Kernel
