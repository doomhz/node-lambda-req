const LambdaReq = require('lambda-req').default
const LambdaReqError = require('lambda-req').LambdaReqError

// initialize Lambda with no params, pass them later from handler
const lambda = new LambdaReq()

// set handlers
lambda.get('/v1/test', (req, ev)=> {})
lambda.proxy('migrate', (req, ev)=> Promise.resolve({}))

// export the handler
// set the event params on invocation time by AWS Lambda itself
module.exports = { handler: lambda.invoke }