const { LambdaReq, LambdaReqError } = require('lambda-req')

// event - holds all the Lambda headers and request info
// context - has information about the Lambda runtime - http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
// callback - optional function to be called after the code execution, i.e. callback(error, stringResponse)
function handler (event, context, callback) {
  console.log('Lambda params:', JSON.stringify(event))

  // initialize wrapper
  const lambda = new LambdaReq(event, context, callback)

  // get | post | put | delete | options
  lambda.get('/v1/test', (req, ev)=> {
    const { params, headers } = req
    
    if (params.email !== 'test@test.com') {
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
    
    return { user: { id: 1 } }
  })

  // direct task invoke
  lambda.task('migrate', (req, ev)=> {
    const { params } = req
    return Promise.resolve({ success: true })
  })

  // execute
  lambda.invoke()
}

module.exports = { handler }