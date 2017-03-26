import AWS from 'aws-sdk'
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