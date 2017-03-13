class LambdaReq {
  
  constructor (event, callback, context) {
    console.assert(typeof event === 'object', 'Malformed Lambda event object.')
    console.assert(typeof callback === 'function', 'Malformed Lambda callback function.')
    
    this._event = event
    this._callback = callback
    this._context = context
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

  get currentRoute () {
    if (this.isApiGateway) {
      return `${this._parseApiGatewayData().method}_${this._parseApiGatewayData().path}`
    }
  }

  get currentTask () {
    if (this.isTask) {
      return this._event.task
    }
  }

  respond (response, error) {
    if (this.isApiGateway) {
      return this._respondToApiGateway(response, error)
    }
    if (this.isTask) {
      return this._respondToTask(response, error)
    }
    return this._respondPlain(response, error)
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