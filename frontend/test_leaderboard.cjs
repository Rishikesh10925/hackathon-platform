const axios = require('axios');

async function test(url) {
  try {
    const res = await axios.get(url);
    console.log('[SUCCESS]', url);
    console.log(JSON.stringify(res.data, null, 2).substring(0, 500));
  } catch(e) {
    if (e.response) {
      console.log('[ERROR]', url, e.response.status, e.response.statusText);
    } else {
      console.log('[ERROR]', url, e.message);
    }
  }
}

async function run() {
  await test('https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/leaderboard');
  await test('https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/dev/leaderboard');
  await test('https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/prod/leaderboard');
}

run();
