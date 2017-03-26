import should from 'should'
import sinon from 'sinon'
import { LambdaProxy } from '../../src/index'

describe('LambdaProxy', () => {

  describe('invoke', () => {

    describe('on successful Lambda invocation', () => {
      
      it('returns a JSON result', () => {
        const params = { id: 123 }
        const lambdaResponse = {
          Payload: JSON.stringify({ username: 'john' })
        }
        const lambdaClient = {
          invoke: sinon.stub().returns({
            promise: sinon.stub().returns(Promise.resolve(lambdaResponse))
          })
        }
        const proxy = new LambdaProxy(lambdaClient)
        return proxy.invoke('myFunction', 'myCommand', params)
        .then((res)=> {
          res.should.eql(JSON.parse(lambdaResponse.Payload))
          lambdaClient.invoke.calledWith({
            FunctionName: 'myFunction',
            Payload: JSON.stringify({ command: 'myCommand', params: {id: 123 } })
          }).should.eql(true)
        })
      })
    
    })
  
  })
})