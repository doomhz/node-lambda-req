class LambdaReq {
  
  constructor (event, callback, context) {
    console.assert(
      typeof event === 'object' && event !== null,
      'Malformed Lambda event object.'
    )
    console.assert(
      typeof callback === 'function',
      'Malformed Lambda callback.'
    )
    
    this._event = event
    this._callback = callback
    this._context = context
    this._routes = {}
  }

  get isApiGateway () {
    return !!this._event.httpMethod
  }

  get isTask () {
    return !!this._event.task
  }

  get params () {
    if (this.isApiGateway) {
      return this._parseApiGatewayData().params
    }
    if (this.isTask) {
      return this._parseTaskData()
    }
    return this._event
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
    if (this.isTask) {
      return `TASK_${this._event.task}`
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

  task (name, handler) {
    this._route(`TASK_${name}`, handler)
  }

  invoke () {
    // return error when there is no handler found
    if (typeof this._routes[this.currentRoute] !== 'function') {
      return this._respond(null, `Unhandled event: ${JSON.stringify(this._event)}`)
    }
    try {
      // execute the route handler
      const result = this._routes[this.currentRoute]({
        params: Object.assign({}, this.params),
        headers: Object.assign({}, this.headers),
      }, Object.assign({}, this._event))
      if (result && result.then) {
        // handle a Promise result
        return result.then((res)=> this._respond(res))
      } else {
        // handle any other result
        return this._respond(result)
      }
    } catch (err) {
      // catch any error and respond accordingly to the call type
      return this._respond(null, err)
    }
  }

  _respond (response, error) {
    if (this.isApiGateway) {
      return this._respondToApiGateway(response, error)
    }
    if (this.isTask) {
      return this._respondToTask(response, error)
    }
    return this._respondPlain(response, error)
  }
  
  _route (id, handler) {
    this._routes[id] = handler
  }

  _parseApiGatewayData (event = this._event) {
    const body = {}
    try {
      Object.assign(body, JSON.parse(event.body))
    } catch (err) {
      console.warn(`Could not parse event.body: ${event.body}`, err)
    }
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

  _parseTaskData (event = this._event) {
    return event.params
  }

  _respondToTask (response, error) {
    response = { result: response }
    try {
      response = JSON.stringify(response)
    } catch (e) {
      response = `${response}`
    }

    this._callback(error, response)
  }

  _respondPlain (response, error) {
    try {
      response = JSON.stringify(response)
    } catch (e) {
      response = `${response}`
    }

    this._callback(error, response)
  }

  _respondToApiGateway (response, error) {
    const statusCode = error ? 400 : 200
    
    if (error) {
      response = typeof error === Error ? error.message : error
    }
    try {
      response = JSON.stringify(response)
    } catch (e) {
      response = `${response}`
    }
    
    const apiGatewayResponse = {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: response
    }
    
    this._callback(null, apiGatewayResponse)
  }

}

export default LambdaReq