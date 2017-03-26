# AWS Lambda Router for NodeJS

## Install

`npm install lambda-req --save`

## Deploy it on Lambda

```javascript
import LambdaReq, { LambdaReqError } from 'lambda-req'

// initialize Lambda with no params, pass them later from handler
const lambda = new LambdaReq()

// set handlers
lambda.get('/v1/test', (req, ev)=> {})
lambda.proxy('migrate', (req, ev)=> Promise.resolve({}))

// export the handler
// set the event params on invocation time by AWS Lambda itself
export { handler: lambda.invoke }
```

## Deploy it with Apex

```javascript
import LambdaReq, { LambdaReqError } from 'lambda-req'

const lambda = new LambdaReq()

// set APIGateway handlers
lambda.get('/lreqex_hello', (req, ev)=> {
  const { params } = req
  return { message: 'hello world!', params }
})
lambda.post('/lreqex_hello', (req, ev)=> {
  const { params } = req
  return { message: 'hello world!', params }
})

// set direct invocation handlers
lambda.proxy('hello', (req, ev)=> {
  const { params } = req
  return { message: 'hello world!', params }
})

export default lambda.invoke
```

## Invoke other Lambdas

```javascript
import LambdaReq, { LambdaProxy, LambdaReqError } from 'lambda-req'

const lambda = new LambdaReq()

// set APIGateway handlers
lambda.get('/lreqex_proxy', (req, ev)=> {
  const { params } = req
  
  const proxy = new LambdaProxy()
  
  // Invoke another Lambda in the same AWS VPC
  return proxy.invoke('lreqex_hello', 'hello', params)
  .then((response)=> {
    return { message: 'Proxy response from lreqex_hello', response }
  })
  .catch((err)=> {
    console.error(err)
    throw new LambdaReqError({
      message: {
        error: {
          code: 'lambdaInvocationError',
          message: 'lreqex_hello Lambda is unresponsive.'
        }
      }
    })
  })
})

export default lambda.invoke
```

See [more examples](examples/).


## API


### LambdaReq

#### .constructor([event = `Object`], [context = `Object`], [callback = `function`])

#### .get|.post|.put|.delete|.options(path = `String`, handler = `function`)

#### .proxy(name = `String`, handler = `function`)

#### .invoke([event = `Object`], [context = `Object`], [callback = `function`])

#### .isApiGateway `Bool`

#### .isProxy `Bool`

#### .params `Object`

#### .headers `Object`

#### .currentRoute `String`


### LambdaProxy

#### .constructor([client = `Object` = `AWS.Lambda`])

#### .invoke(functionName = `String`, command = `String`, [params = `Object`])


### LambdaReqError

#### .constructor({ message, status })
