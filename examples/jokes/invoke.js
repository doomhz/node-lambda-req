/**
* Simulates a Lambda invocation request on localhost
*/

const handler = require('./src/index').handler

const task = 'joke'
const params = {
}
const apiGatewayEvent = {
  httpMethod: 'GET',
  resource: '/jokes/{id}',
  headers: {
    'Content-Type': 'application/json'
  },
  // queryStringParameters: {
  //   name: 'john'
  // },
  pathParameters: {
    id: '1'
  },
  // body: '{"active":true}'
}

handler(apiGatewayEvent, {}, (err, response)=> {
// handler({ task, params }, {}, (err, response)=> {
  if (err) {
    return console.error('Lambda error: ', err)
  }
  console.log('Lambda response: ', response)
})