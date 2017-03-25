const LambdaReq = require('lambda-req').default
const LambdaReqError = require('lambda-req').LambdaReqError
const getJoke = require('./data/jokes').getJoke

const lambda = new LambdaReq()

// set handlers
lambda.get('/jokes', (req, ev)=> getJoke())
lambda.get('/jokes/{id}', (req, ev)=> {
  const id = req.params.id
  const joke = getJoke(id)
  if (!joke) {
    throw new LambdaReqError({
      message: {
        error: {
          code: 'jokeNotFound'
        }
      },
      status: 404
    })
  }
  return joke
})
lambda.task('joke', (req, ev)=> {
  const id = req.params.id
  const joke = getJoke(id)
  if (!joke) {
    throw new LambdaReqError({
      message: 'jokeNotFound'
    })
  }
  return joke
})

module.exports = { handler: lambda.invoke }