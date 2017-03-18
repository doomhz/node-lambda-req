import should from 'should'
import sinon from 'sinon'
import LambdaReq from '../../src/index'

describe('LambdaReq', () => {
  
  it('inits with a lambda event object', () => {
    const event = null
    const callback = sinon.stub()
    const context = {}
    should(()=> new LambdaReq(event, callback, context))
    .throw(/Malformed Lambda event object/)
  })

  it('inits with a lambda callback', () => {
    const event = {}
    const callback = null
    const context = {}
    should(()=> new LambdaReq(event, callback, context))
    .throw(/Malformed Lambda callback/)
  })

  describe('invoke', () => {
        
    const event = {
      httpMethod: 'GET',
      resource: '/v1/test',
      headers: {
        'Content-Type': 'application/json'
      },
      queryStringParameters: {
        name: 'john'
      },
      pathParameters: {
        id: 'u-123'
      },
      body: '{"active":true}'
    }
    
    it('responds', () => {
      const callback = sinon.stub()
      const handler = sinon.stub().returns({ success: true })
      const lambda = new LambdaReq(event, callback)
      lambda.get('/v1/test', handler)
      lambda.invoke()
      should(handler.calledWith(
        { params: { name: 'john', id: 'u-123', active: true },
          headers: { 'Content-Type': 'application/json' }
        },
        event
      )).eql(true)
      should(callback.getCall(0).args[1]).containEql({
        body: '{"success":true}'
      })
    })

    describe('when the handler result is a promise', () => {
      it('waits for the promise to resolve then it responds', () => {
        const callback = sinon.stub()
        const handler = sinon.stub().returns(Promise.resolve({ success: true }))
        const lambda = new LambdaReq(event, callback)
        lambda.get('/v1/test', handler)
        return lambda.invoke()
        .then(()=> {
          should(handler.calledWith(
            { params: { name: 'john', id: 'u-123', active: true },
              headers: { 'Content-Type': 'application/json' }
            },
            event
          )).eql(true)
          should(callback.getCall(0).args[1]).containEql({
            body: '{"success":true}'
          })
        })
      })
    })
  })

  describe('isApiGateway', () => {
    describe('when it has a httpMethod set on event', () => {
      it('returns true', () => {
        const event = { httpMethod: 'GET' }
        const callback = sinon.stub()
        const lambda = new LambdaReq(event, callback)
        lambda.isApiGateway.should.eql(true)
      })
    })
    describe('when it has no httpMethod set on event', () => {
      it('returns false', () => {
        const event = {}
        const callback = sinon.stub()
        const lambda = new LambdaReq(event, callback)
        lambda.isApiGateway.should.eql(false)
      })
    })
  })

  describe('isTask', () => {
    describe('when it has a task property set on event', () => {
      it('returns true', () => {
        const event = { task: 'test' }
        const callback = sinon.stub()
        const lambda = new LambdaReq(event, callback)
        lambda.isTask.should.eql(true)
      })
    })
    describe('when it has no task property set on event', () => {
      it('returns false', () => {
        const event = {}
        const callback = sinon.stub()
        const lambda = new LambdaReq(event, callback)
        lambda.isTask.should.eql(false)
      })
    })
  })

})