import should from 'should'
import sinon from 'sinon'
import { LambdaReqError } from '../../src/index'

describe('LambdaReqError', () => {

  describe('toString', () => {

    describe('when the message is an object', () => {
      it('returns the stringified message', () => {
        const error = new LambdaReqError({ message: { error: 'User not found.' }, status: 404 })
        error.toString().should.eql('LambdaReqError: status: 404, message: {"error":"User not found."}')
      })
    })
  
  })
})