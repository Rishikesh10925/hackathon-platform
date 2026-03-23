const axios = require('axios');

async function test(url) {
  try {
    const res = await axios.get(url);
    console.log('[SUCCESS]', url, res.data);
  } catch(e) {
    if (e.response) {
      console.log('[ERROR]', url, e.response.status, e.response.statusText);
    } else {
      console.log('[ERROR]', url, e.message);
    }
  }
}

async function run() {
  const base = 'https://xe6yu454x0.execute-api.us-east-1.amazonaws.com';
  await test(base + '/getEvents');
  await test(base + '/dev/getEvents');
  await test(base + '/prod/getEvents');
  await test(base + '/events');
  await test(base + '/api/events');
}

run();
