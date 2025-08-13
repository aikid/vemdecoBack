import createLogger from '../config/cloudwatch/logger'

class Logger {
  preHandler(req: any, res: any, next: any) {
    const { method, originalUrl, params, query, headers } = req
    let { body } = req
    const customer = 'resumo-rapido'

    req.logger = createLogger(customer)

    if (originalUrl.includes('signin')) {
      body = {
        email: '*********@************',
        password: '*****************'
      }
    }

    const addBreadcrumb = {
      request: {
        customer,
        category: 'http',
        data: {
          method,
          headers,
          url: originalUrl,
          params,
          query,
          body
        }
      },
      response: null,
      error: null
    }
    req.breadcrumb = addBreadcrumb
    next()
  }

  captureResult(req: any, response: any) {
    const { breadcrumb } = req
    breadcrumb.response = response
    req.logger.info(breadcrumb)
  }

  captureMessage(customer: any, message: any) {
    const logger = createLogger(customer)
    logger.info(message)
  }

  captureException(req: any, err: any) {
    const { breadcrumb } = req
    breadcrumb.response = err.message
    req.logger.error(breadcrumb)
  }
}

export default new Logger()
