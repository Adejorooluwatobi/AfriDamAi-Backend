import axios from 'axios';

async function testLiveKitToken() {
  // Use BASE_URL from env or default to localhost
  const baseUrl = process.env.BASE_URL || 'http://localhost:8081'; 
  const room = 'test-room';
  const identity = 'test-user';

  console.log(`Testing LiveKit token generation for room: ${room}, identity: ${identity}...`);

  try {
    const response = await axios.get(`${baseUrl}/rtc/token`, {
      params: { room, identity }
    });

    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));

    if (response.data.token && response.data.serverUrl) {
      console.log('SUCCESS: Token and serverUrl received.');
    } else {
      console.log('FAILURE: Missing token or serverUrl in response.');
    }
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.error('FAILURE: Connection refused. Is the NestJS server running?');
    } else if (error.response) {
      console.error('FAILURE: Server responded with error:', error.response.status, error.response.data);
    } else {
      console.error('FAILURE: An unexpected error occurred:', error.message);
    }
  }
}

testLiveKitToken();
