import LambdaReq, { LambdaReqError } from 'lambda-req'

const lambda = new LambdaReq()

// set APIGateway handlers
lambda.get('/lreqex_hello', (req, ev)=> {
  const { params } = req
  return { message: 'hello world!', params }
})

lambda.get('/lreqex_hello/{username}', (req, ev)=> {
  const { params } = req
  return { message: `hello ${params.username}!`, params }
})

lambda.post('/lreqex_hello', (req, ev)=> {
  const { params } = req
  
  return new Promise((resolve, reject)=> {

    // simulate a slow task
    setTimeout(()=> {
      if (!params.username) {
        reject(new LambdaReqError({
          message: {
            error: {
              code: 'invalidData',
              data: {
                username: 'Please specify a username.'
              }
            }
          },
          status: 409
        }))
      }
      resolve({ message: 'User created!', params })
    }, 1500)
  })
})

lambda.put('/lreqex_hello/{username}', (req, ev)=> {
  const { params } = req
  return { message: `User ${params.username} updated!`, params }
})

lambda.delete('/lreqex_hello/{username}', (req, ev)=> {
  const { params } = req
  return { message: `User ${params.username} deleted!`, params }
})


// set direct invocation handlers
lambda.task('hello', (req, ev)=> {
  const { params } = req
  return { message: 'hello world!', params }
})

export default lambda.invoke