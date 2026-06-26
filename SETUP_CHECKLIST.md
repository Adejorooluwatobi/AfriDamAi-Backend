# Real-Time Chat Setup Checklist

## ✅ Backend Setup (Complete!)

Your backend is now configured with real-time chat. Here's what's ready:

### 1. Dependencies ✓
- [x] `@nestjs/websockets` - Installed
- [x] `@nestjs/platform-socket.io` - Installed
- [x] `socket.io` - Installed
- [x] JWT authentication - Configured

### 2. Files Created ✓
- [x] `src/shared/websockets/chat.gateway.ts` - Chat WebSocket gateway
- [x] `src/shared/websockets/app.gateway.ts` - Main WebSocket gateway (existing)
- [x] Chat module updated with gateway
- [x] Chat service enhanced with notifications

### 3. Features Enabled ✓
- [x] Real-time bidirectional messaging
- [x] Instant WebSocket notifications
- [x] Typing indicators
- [x] Read receipts
- [x] Message persistence
- [x] Offline message support
- [x] JWT authentication for WebSocket

## 🚀 Quick Start

### Start Your Backend
```bash
npm run start:dev
```

### Test WebSocket Connection
1. Open `test-chat-client.html` in browser
2. Enter backend URL (default: http://localhost:3000)
3. Enter your JWT token
4. Click "Connect"
5. You should see "Connected" status

## 🧪 Testing the Chat

### Method 1: Test Client (Easiest)
1. Open `test-chat-client.html` in TWO browser windows
2. Get a JWT token for User 1 and User 2
3. Create a chat via REST API:
   ```bash
   curl -X POST http://localhost:3000/chats \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"participant1Id": "user1-id", "participant2Id": "user2-id"}'
   ```
4. Copy the chat ID
5. In both windows:
   - Enter JWT token
   - Enter chat ID
   - Enter user ID (different for each window)
   - Click "Connect"
6. Type messages in one window
7. See them appear instantly in the other window!

### Method 2: REST API
```bash
# Create a chat
curl -X POST http://localhost:3000/chats \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"participant1Id": "user1", "participant2Id": "user2"}'

# Send a message
curl -X POST http://localhost:3000/chats/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"chatId": "chat-id", "senderId": "user1", "message": "Hello!"}'

# Get messages
curl http://localhost:3000/chats/CHAT_ID/messages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔍 Verify WebSocket Connection

### Check Server Logs
When a client connects, you should see:
```
[AppGateway] Client connected: <socket-id>
[AppGateway] Client <socket-id> connected as User ID: <user-id>, Role: <role>
[ChatGateway] Client connected to chat namespace
```

### Check Browser Console
```javascript
// In browser console
const socket = io('http://localhost:3000', { 
  query: { token: 'YOUR_JWT_TOKEN' } 
});

socket.on('connect', () => console.log('Connected!'));
socket.on('disconnect', () => console.log('Disconnected!'));
```

## 📊 WebSocket Endpoints

Your backend now has these WebSocket namespaces:

1. **Main Gateway** - `ws://localhost:3000`
   - General notifications
   - User connections
   - Message notifications

2. **Chat Gateway** - `ws://localhost:3000/chat`
   - Real-time messaging
   - Typing indicators
   - Read receipts

## 🔐 Authentication

WebSocket connections require JWT token:

### Via Query Parameter (Recommended)
```javascript
io('http://localhost:3000', { query: { token: 'YOUR_JWT_TOKEN' } })
```

### Via Authorization Header
```javascript
io('http://localhost:3000', { 
  extraHeaders: { Authorization: 'Bearer YOUR_JWT_TOKEN' }
})
```

## 🎯 Integration Checklist

### For Frontend Developers:

- [ ] Install socket.io-client: `npm install socket.io-client`
- [ ] Connect to WebSocket with JWT token
- [ ] Listen for 'newMessage' events
- [ ] Emit 'sendMessage' events
- [ ] Handle connection/disconnection
- [ ] Display messages in UI
- [ ] Add typing indicators
- [ ] Add read receipts

### Example Code:
```javascript
import io from 'socket.io-client';

// Connect
const socket = io('http://your-backend', { 
  query: { token: localStorage.getItem('token') } 
});

// Receive messages
socket.on('newMessage', (message) => {
  console.log('New message:', message);
  // Add to your UI
});

// Send messages
function sendMessage(chatId, userId, text) {
  socket.emit('sendMessage', {
    chatId,
    senderId: userId,
    message: text
  });
}
```

## 🐛 Troubleshooting

### Connection Refused
- ✓ Check backend is running
- ✓ Verify port (default: 3000)
- ✓ Check firewall settings

### Authentication Failed
- ✓ Verify JWT token is valid
- ✓ Check token format: `Bearer <token>`
- ✓ Ensure JWT_SECRET is set in .env

### Messages Not Delivering
- ✓ Check both users are connected
- ✓ Verify chat ID exists
- ✓ Check user IDs are correct
- ✓ Look at server logs for errors

### CORS Issues
- ✓ WebSocket gateway has `cors: true`
- ✓ Check your frontend URL is allowed
- ✓ Verify credentials are included

## 📝 Environment Variables

Make sure these are set in your `.env`:

```env
JWT_SECRET=your_secret_key
DATABASE_URL=your_database_url
PORT=3000
```

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ Client connects without errors
2. ✅ Server logs show connection
3. ✅ Messages appear instantly in other window
4. ✅ Typing indicators work
5. ✅ No console errors

## 📚 Documentation Files

- `IMPLEMENTATION_SUMMARY.md` - What was implemented
- `REALTIME_CHAT_GUIDE.md` - Complete technical docs
- `QUICK_START_CHAT.md` - Quick start for developers
- `test-chat-client.html` - Test client

## 🚀 Production Checklist

Before deploying to production:

- [ ] Set strong JWT_SECRET
- [ ] Configure CORS properly
- [ ] Set up SSL/TLS (wss://)
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Test with multiple users
- [ ] Test offline scenarios
- [ ] Test reconnection logic

## 💡 Tips

1. **Keep connections alive** - WebSocket connections can timeout
2. **Handle reconnection** - Implement auto-reconnect logic
3. **Show connection status** - Let users know if they're online
4. **Cache messages** - Store messages locally
5. **Implement pagination** - For message history

## 🎯 Next Steps

1. ✅ Backend is ready
2. → Implement frontend UI
3. → Test with real users
4. → Add push notifications (optional)
5. → Deploy to production

---

**Your real-time chat system is ready to use! 🎉**

Need help? Check the documentation files or use the test client to verify everything works.
