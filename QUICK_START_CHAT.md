# Real-Time Chat Quick Start Guide

## ✅ What's Implemented

Your backend now supports **real-time bidirectional chat** between users and specialists with:

1. **Instant WebSocket messaging** - Messages are delivered in real-time
2. **Instant notifications** - Both parties receive WebSocket notifications immediately
3. **Typing indicators** - See when the other person is typing
4. **Read receipts** - Know when messages are read
5. **Offline support** - Messages saved to database for offline users
6. **JWT authentication** - Secure WebSocket connections

## 🚀 How It Works

### When a Specialist Accepts a Text Request:

1. **Chat is created** between user and specialist
2. **Both connect** to WebSocket server with their JWT tokens
3. **Messages are instant** - sent via WebSocket and saved to database
4. **Notifications are instant** - delivered via WebSocket to online users
5. **Both can chat** in real-time like WhatsApp/Telegram

### Message Flow:

```
User sends message → Backend receives → Saves to DB → Sends to Specialist (WebSocket)
                                     ↓
                              Creates notification
                                     ↓
                         Specialist receives instantly
```

## 📱 Client Implementation (3 Steps)

### Step 1: Install Socket.IO Client

```bash
npm install socket.io-client
# or
yarn add socket.io-client
```

### Step 2: Connect to WebSocket

```javascript
import io from 'socket.io-client';

// Get JWT token from your auth system
const token = localStorage.getItem('authToken');

// Connect to main gateway (for notifications)
const mainSocket = io('http://your-backend-url', {
  query: { token }
});

// Connect to chat namespace (for messaging)
const chatSocket = io('http://your-backend-url/chat', {
  query: { token }
});

// Listen for connection
mainSocket.on('connect', () => {
  console.log('Connected to chat server!');
});
```

### Step 3: Send and Receive Messages

```javascript
// Send a message
function sendMessage(chatId, userId, message) {
  chatSocket.emit('sendMessage', {
    chatId,
    senderId: userId,
    message
  });
}

// Receive messages instantly
mainSocket.on('newMessage', (message) => {
  console.log('New message:', message);
  // Update your UI with the new message
  addMessageToUI(message);
});

// Get confirmation when message is sent
chatSocket.on('messageSent', (message) => {
  console.log('Message sent successfully:', message);
});
```

## 🎯 Complete Example (React)

```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function Chat({ chatId, userId, token }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Connect
    const main = io('http://your-backend-url', { query: { token } });
    const chat = io('http://your-backend-url/chat', { query: { token } });

    // Receive messages
    main.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Typing indicator
    main.on('userTyping', (data) => {
      setIsTyping(data.isTyping);
    });

    return () => {
      main.disconnect();
      chat.disconnect();
    };
  }, [token]);

  const send = () => {
    chatSocket.emit('sendMessage', {
      chatId,
      senderId: userId,
      message: input
    });
    setInput('');
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>{msg.message}</div>
        ))}
        {isTyping && <p>User is typing...</p>}
      </div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && send()}
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
```

## 🔧 REST API (Alternative to WebSocket)

You can also use REST API if WebSocket is not available:

```javascript
// Send message via HTTP
async function sendMessage(chatId, senderId, message) {
  const response = await fetch('http://your-backend-url/chats/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ chatId, senderId, message })
  });
  return response.json();
}

// Get messages
async function getMessages(chatId) {
  const response = await fetch(`http://your-backend-url/chats/${chatId}/messages`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
}
```

## 📊 WebSocket Events Reference

### Send Events (Client → Server)

```javascript
// Send message
chatSocket.emit('sendMessage', { chatId, senderId, message });

// Send typing status
chatSocket.emit('typing', { chatId, senderId, isTyping: true });

// Mark as read
chatSocket.emit('markAsRead', { messageId });
```

### Receive Events (Server → Client)

```javascript
// New message received
mainSocket.on('newMessage', (message) => { });

// Message sent confirmation
chatSocket.on('messageSent', (message) => { });

// User typing
mainSocket.on('userTyping', ({ chatId, userId, isTyping }) => { });

// Message read
mainSocket.on('messageRead', ({ messageId }) => { });

// Error
chatSocket.on('error', ({ message }) => { });
```

## 🧪 Testing

1. Open `test-chat-client.html` in two browser windows
2. Enter your JWT token in both
3. Create a chat and get the chat ID
4. Enter the chat ID in both windows
5. Start chatting - messages appear instantly!

## 🔐 Security

- JWT token required for WebSocket connection
- Token validated on connection
- Users can only access their own chats
- All messages are validated

## 📝 Database

Messages are automatically saved to the database:
- Persistent storage
- Offline message delivery
- Message history
- Read receipts

## 🎨 UI Features to Implement

1. **Message list** - Display all messages
2. **Input field** - Type and send messages
3. **Typing indicator** - Show when other user is typing
4. **Read receipts** - Show ✓✓ when message is read
5. **Timestamp** - Show when message was sent
6. **Online status** - Show if user is online

## 🚨 Common Issues

### "Not connected"
- Check JWT token is valid
- Verify backend URL is correct
- Check CORS settings

### "Messages not delivering"
- Ensure both users are connected
- Check chatId is correct
- Verify user IDs are correct

### "Connection refused"
- Check backend is running
- Verify port is correct (default: 3000)
- Check firewall settings

## 📚 Next Steps

1. Implement the client UI
2. Add push notifications for mobile
3. Add file/image sharing
4. Add message reactions
5. Add group chat support

## 💡 Tips

- Keep WebSocket connection alive
- Reconnect automatically on disconnect
- Show connection status to user
- Cache messages locally
- Implement pagination for message history

---

**Need help?** Check `REALTIME_CHAT_GUIDE.md` for detailed documentation.
