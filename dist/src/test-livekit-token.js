"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function testLiveKitToken() {
    const baseUrl = process.env.BASE_URL || 'http://localhost:8081';
    const room = 'test-room';
    const identity = 'test-user';
    console.log(`Testing LiveKit token generation for room: ${room}, identity: ${identity}...`);
    try {
        const response = await axios_1.default.get(`${baseUrl}/rtc/token`, {
            params: { room, identity }
        });
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));
        if (response.data.token && response.data.serverUrl) {
            console.log('SUCCESS: Token and serverUrl received.');
        }
        else {
            console.log('FAILURE: Missing token or serverUrl in response.');
        }
    }
    catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('FAILURE: Connection refused. Is the NestJS server running?');
        }
        else if (error.response) {
            console.error('FAILURE: Server responded with error:', error.response.status, error.response.data);
        }
        else {
            console.error('FAILURE: An unexpected error occurred:', error.message);
        }
    }
}
testLiveKitToken();
//# sourceMappingURL=test-livekit-token.js.map