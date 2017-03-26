# AWS Lambda Router for NodeJS

[![Build Status](https://travis-ci.org/doomhz/node-lambda-req.svg?branch=master)](https://travis-ci.org/doomhz/node-lambda-req) [![Coverage Status](https://coveralls.io/repos/github/doomhz/node-lambda-req/badge.svg?branch=master)](https://coveralls.io/github/doomhz/node-lambda-req?branch=master)

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


## License

(The MIT License)

Copyright (c) 2017 Dumitru Glavan &lt;contact@dumitruglavan.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
