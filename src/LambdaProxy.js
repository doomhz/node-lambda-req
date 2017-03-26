import AWS from 'aws-sdk'

export default class LambdaProxy {
  
  constructor (client = new AWS.Lambda()) {
    this._client = client
  }

  invoke (functionName, command, params) {
    const config = {
      FunctionName: functionName,
      Payload: JSON.stringify(Object.assign({}, { command }, { params }))
    }
    return this._client.invoke(config).promise()
    .then(response => JSON.parse(response.Payload))
  }
}