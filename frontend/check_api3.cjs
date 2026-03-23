const axios = require('axios');
async function test(method, path) {
  try {
     const res = await axios({ method, url: 'https://xe6yu454x0.execute-api.us-east-1.amazonaws.com' + path, data: method === 'post' ? {} : undefined });
     console.log('[SUCCESS]', method, path, res.status);
  } catch(e) {
     console.log('[ERROR]', method, path, e.response ? e.response.status : e.message);
  }
}
async function run() {
  await test('get', '/createEvent');
  await test('get', '/getEvent');
  await test('get', '/events');
  await test('get', '/getEvents');
}
run();
