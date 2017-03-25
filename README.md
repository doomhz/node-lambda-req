# AWS Lambda Request Wrapper for NodeJS

## Install

`npm install lambda-req --save`

## Use

```javascript
import LambdaReq, { LambdaReqError } from 'lambda-req'

// initialize Lambda with no params, pass them later from handler
const lambda = new LambdaReq()

// set handlers
lambda.get('/v1/test', (req, ev)=> {})
lambda.task('migrate', (req, ev)=> Promise.resolve({}))

// export the handler
// set the event params on invocation time by AWS Lambda itself
export { handler: lambda.invoke }
```