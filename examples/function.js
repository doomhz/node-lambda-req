const LambdaReq = require('lambda-req').default
const LambdaReqError = require('lambda-req').LambdaReqError

// event - holds all the Lambda headers and request info
// context - has information about the Lambda runtime - http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
// callback - optional function to be called after the code execution, i.e. callback(error, stringResponse)
function handler (event, context, callback) {
  console.log('Lambda params:', JSON.stringify(event))

  // initialize Lambda with params
  const lambda = new LambdaReq(event, context, callback)

  // get | post | put | delete | options
  lambda.get('/v1/test', (req, ev)=> {
    // access params and headers for APIGateway invocations
    const { params, headers } = req
    
    if (params.email !== 'test@test.com') {
      // Throw on soft errors
      throw new LambdaReqError({
        message: {
          error: 'User not found',
          data: {
            email: 'Invalid'
          }
        },
        status: 404
      })
    }
    
    // return on success
    return { user: { id: 1 } }
  })

  // direct task invoke, returns a Promise
  lambda.task('migrate', (req, ev)=> {
    // access params for tasks
    const { params } = req

    // return a promise as a result, it will be awaited by LambdaReq
    return Promise.resolve({ success: true })
  })

  // execute handlers
  lambda.invoke()
}

module.exports = { handler }