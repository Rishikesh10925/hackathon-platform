const axios = require('axios');
async function run() {
  try {
     const res = await axios.post('https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/createEvent', {});
     console.log(res.data);
  } catch(e) {
     console.log(e.response ? e.response.status : e.message);
  }
}
run();
