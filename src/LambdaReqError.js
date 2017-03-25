export default class LambdaReqError {
  
  constructor ({ message, status }) {
    this.message = message
    this.status = status || 500
  }

  toString () {
    const message = JSON.stringify(this.message)
    return `LambdaReqError: status: ${this.status}, message: ${message}`
  }
}