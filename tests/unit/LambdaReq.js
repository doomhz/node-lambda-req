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
    .throw(/Malformed Lambda callback function/)
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