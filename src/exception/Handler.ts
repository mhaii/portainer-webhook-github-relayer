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

  public static clientErrorHandler(err, req, res, next): any {
    Log.error(err.stack)

    if (req.xhr) {
      return res.status(500).send({ error: 'Something went wrong!' })
    } else {
      return next(err)
    }
  }

  public static errorHandler(err, req, res): any {
    Log.error(err.stack)
    res.status(500)

    return res.json({
      error: err,
    })
  }

  public static logErrors(err, req, res, next): any {
    Log.error(err.stack)

    return next(err)
  }
}

export default Handler
