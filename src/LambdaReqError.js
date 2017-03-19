export default class LambdaReqError {
  
  constructor ({ message, status }) {
    this.message = message
    this.status = status || 500
  }

  toString () {
    let message

    try {
      message = JSON.stringify(this.message)
    } catch (e) {
      message = `${this.message}`
    }
    
    return `LambdaReqError: status: ${this.status}, message: ${message}`
  }
}