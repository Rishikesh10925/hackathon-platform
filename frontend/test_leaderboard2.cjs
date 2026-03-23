const axios = require('axios');

async function test(url) {
  try {
    console.log('Testing:', url);
    const res = await axios.get(url);
    console.log('[SUCCESS]', res.status);
    console.log(JSON.stringify(res.data, null, 2).substring(0, 500));
  } catch(e) {
    if (e.response) {
      console.log('[ERROR]', e.response.status, e.response.data);
    } else {
      console.log('[ERROR]', e.message);
    }
  }
}

async function run() {
  await test('https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/leaderboard?eventId=Test');
}

run();
