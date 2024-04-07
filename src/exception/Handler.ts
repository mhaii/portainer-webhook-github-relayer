import Log from '../middlewares/Log'

class Handler {
  public static notFoundHandler(_express): any {
    _express.use('*', (req, res) => {
      return res.json({
        error: 'Page Not Found',
      })
    })

    return _express
  }
}

export default Handler
