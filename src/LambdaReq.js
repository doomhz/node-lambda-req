import debug from 'debug'
import LambdaReqError from './LambdaReqError'

const log = debug('LambdaReq:')

class LambdaReq {
  
  constructor (event, context, callback) {
    this._event = event
    this._callback = callback
    this._context = context
    this._routes = {}
  }

  get isApiGateway () {
    return !!this._event.httpMethod
  }

  get isProxy () {
    return !!this._event.command
  }

  get params () {
    if (this.isApiGateway) {
      return this._parseApiGatewayData().params
    }
    if (this.isProxy) {
      return this._parseProxyData().params
    }
  }

  get headers () {
    if (this.isApiGateway) {
      return this._parseApiGatewayData().headers
    }
  }

  get currentRoute () {
    if (this.isApiGateway) {
      return `${this._parseApiGatewayData().method}_${this._parseApiGatewayData().path}`
    }
    if (this.isProxy) {
      return `PROXY_${this._event.command}`
    }
  }

  get (path, handler) {
    this._route(`GET_${path}`, handler)
  }

  post (path, handler) {
    this._route(`POST_${path}`, handler)
  }

  put (path, handler) {
    this._route(`PUT_${path}`, handler)
  }

  delete (path, handler) {
    this._route(`DELETE_${path}`, handler)
  }

  options (path, handler) {
    this._route(`OPTIONS_${path}`, handler)
  }

  proxy (name, handler) {
    this._route(`PROXY_${name}`, handler)
  }

  invoke = (event = this._event, context = this._context, callback = this._callback)=> {
    this._event = event
    this._context = context
    this._callback = callback

    console.assert(typeof event === 'object' && event !== null, 'Malformed Lambda event object.')
    console.assert(typeof callback === 'function', 'Malformed Lambda callback.')
    
    log('handling invocation for route %s', this.currentRoute)

    if (typeof this._routes[this.currentRoute] !== 'function') {
      log('unhandled route %s', this.currentRoute)
      const error = new LambdaReqError({
        message: {
          error: `Unhandled route: ${this.currentRoute}`
        },
        status: 404
      })
      return this._respond(error)
    }

    log('executing the route handler for %s', this.currentRoute)

    const reqData = {
      params: Object.assign({}, this.params),
      headers: this.headers ? Object.assign({}, this.headers) : undefined
    }

    let result
    try {
      result = this._routes[this.currentRoute](reqData, Object.assign({}, this))
    } catch (err) {
      log('handler %s responded with error: %s', this.currentRoute, err)
      return this._respond(err)
    }
    
    if (result && result.then) {
      log('handling an async result for %s', this.currentRoute)
      return result.then((res)=> this._respond(null, res)).catch((err)=> this._respond(err))
    } else {
      log('handling a sync result for %s', this.currentRoute)
      return this._respond(null, result)
    }
  }

  _respond (error, response) {
    if (this.isApiGateway) {
      return this._respondToApiGateway(error, response)
    }
    if (this.isProxy) {
      return this._respondToProxy(error, response)
    }
  }
  
  _route (id, handler) {
    this._routes[id] = handler
  }

  _parseApiGatewayData (event = this._event) {
    const body = {}
    Object.assign(body, JSON.parse(event.body))

    return {
      method: event.httpMethod,
      path: event.resource,
      headers: event.headers,
      query: event.queryStringParameters,
      pathParams: event.pathParameters,
      body,
      params: Object.assign({}, event.queryStringParameters, event.pathParameters, body)
    }
  }

  _parseProxyData (event = this._event) {
    return event
  }

  _respondToProxy (error, response) {
    log('handling PROXY response: %s %o', error, response)
    
    response = JSON.stringify(response)
    
    log('responding to a proxy: %s %s', error, response)

    this._callback(error, response)
  }

  _respondToApiGateway (error, response) {
    log('handling APIGateway response: %s %o', error, response)
    
    let statusCode
    
    if (error) {
      statusCode = 500
      response = {}

      if (error instanceof Error) {
        log('unhandled exception: %s', error)
      } else if (error instanceof LambdaReqError) {
        log('handled LambdaReqError: %s', error)
        statusCode = error.status
        response = error.message
      } else {
        log('unhandled STRING error: %s', error)
      }
    }

    const apiGatewayResponse = {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    }
    log('responding to APIGateway: %o', apiGatewayResponse)
    
    this._callback(null, apiGatewayResponse)
  }

}

export default LambdaReq