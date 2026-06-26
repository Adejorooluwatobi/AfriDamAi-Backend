# Real-Time Chat System Documentation

## Overview
This system enables instant bidirectional chat between users and specialists with real-time WebSocket notifications.

## Features
- ✅ Real-time message delivery
- ✅ Instant WebSocket notifications for both parties
- ✅ Typing indicators
- ✅ Read receipts
- ✅ Message delivery status
- ✅ Database persistence
- ✅ JWT authentication for WebSocket connections

## Architecture

### WebSocket Namespaces
1. **Main Gateway** (`/`) - General notifications and user connections
2. **Chat Gateway** (`/chat`) - Real-time chat messaging

## Client Integration

### 1. Connect to WebSocket

```javascript
import io from 'socket.io-client';

// Connect to main gateway for notifications
const mainSocket = io('http://your-backend-url', {
  query: { token: 'your-jwt-token' }
});

// Connect to chat namespace for messaging
const chatSocket = io('http://your-backend-url/chat', {
  query: { token: 'your-jwt-token' }
});
```

### 2. Send Messages (Real-time)

```javascript
// Send a message via WebSocket
chatSocket.emit('sendMessage', {
  chatId: 'chat-id',
  senderId: 'user-id',
  message: 'Hello!'
});

// Listen for confirmation
chatSocket.on('messageSent', (message) => {
  console.log('Message sent:', message);
});
```

### 3. Receive Messages (Real-time)

```javascript
// Listen for new messages
mainSocket.on('newMessage', (message) => {
  console.log('New message received:', message);
  // Update UI with new message
});
```

### 4. Typing Indicators

```javascript
// Send typing status
chatSocket.emit('typing', {
  chatId: 'chat-id',
  senderId: 'user-id',
  isTyping: true
});

// Listen for typing status
mainSocket.on('userTyping', (data) => {
  console.log(`User ${data.userId} is typing:`, data.isTyping);
});
```

### 5. Read Receipts

```javascript
// Mark message as read
chatSocket.emit('markAsRead', {
  messageId: 'message-id'
});

// Listen for read receipts
mainSocket.on('messageRead', (data) => {
  console.log('Message read:', data.messageId);
});
```

## REST API Endpoints

### Create Chat
```http
POST /chats
Authorization: Bearer {token}

{
  "participant1Id": "user-id",
  "participant2Id": "specialist-id"
}
```

### Get User Chats
```http
GET /chats/me
Authorization: Bearer {token}
```

### Get Chat Messages
```http
GET /chats/:chatId/messages
Authorization: Bearer {token}
```

### Send Message (HTTP Alternative)
```http
POST /chats/messages
Authorization: Bearer {token}

{
  "chatId": "chat-id",
  "senderId": "user-id",
  "message": "Hello!"
}
```

## WebSocket Events

### Client → Server

| Event | Data | Description |
|-------|------|-------------|
| `sendMessage` | `{ chatId, senderId, message }` | Send a chat message |
| `typing` | `{ chatId, senderId, isTyping }` | Send typing status |
| `markAsRead` | `{ messageId }` | Mark message as read |

### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| `newMessage` | `ChatMessageEntity` | New message received |
| `messageSent` | `ChatMessageEntity` | Message sent confirmation |
| `userTyping` | `{ chatId, userId, isTyping }` | User typing status |
| `messageRead` | `{ messageId }` | Message read confirmation |
| `newChatMessage` | `ChatMessageEntity` | Legacy event for new messages |
| `error` | `{ message }` | Error occurred |

## Flow Diagram

### User → Specialist Message Flow
```
User Client                    Backend                    Specialist Client
    |                             |                              |
    |--sendMessage--------------->|                              |
    |                             |--Save to DB                  |
    |                             |--Send notification---------->|
    |<--messageSent---------------|                              |
    |                             |                              |
    |                             |<--newMessage (WebSocket)-----|
```

### Specialist → User Message Flow
```
Specialist Client              Backend                    User Client
    |                             |                              |
    |--sendMessage--------------->|                              |
    |                             |--Save to DB                  |
    |                             |--Send notification---------->|
    |<--messageSent---------------|                              |
    |                             |                              |
    |                             |<--newMessage (WebSocket)-----|
```

## Example: Complete Chat Implementation

### React/React Native Example

```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function ChatComponent({ chatId, userId, token }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mainSocket, setMainSocket] = useState(null);
  const [chatSocket, setChatSocket] = useState(null);

  useEffect(() => {
    // Connect to WebSocket
    const main = io('http://your-backend-url', {
      query: { token }
    });

    const chat = io('http://your-backend-url/chat', {
      query: { token }
    });

    setMainSocket(main);
    setChatSocket(chat);

    // Listen for new messages
    main.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for typing indicators
    main.on('userTyping', (data) => {
      if (data.chatId === chatId) {
        setIsTyping(data.isTyping);
      }
    });

    // Listen for read receipts
    main.on('messageRead', (data) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId ? { ...msg, isRead: true } : msg
      ));
    });

    return () => {
      main.disconnect();
      chat.disconnect();
    };
  }, [token, chatId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    chatSocket.emit('sendMessage', {
      chatId,
      senderId: userId,
      message: newMessage
    });

    setNewMessage('');
  };

  const handleTyping = (typing) => {
    chatSocket.emit('typing', {
      chatId,
      senderId: userId,
      isTyping: typing
    });
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>
            {msg.message}
            {msg.isRead && <span>✓✓</span>}
          </div>
        ))}
        {isTyping && <div>User is typing...</div>}
      </div>
      
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onFocus={() => handleTyping(true)}
        onBlur={() => handleTyping(false)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

## Database Schema

The chat system uses the following Prisma models:

```prisma
model Chat {
  id             String        @id @default(uuid())
  participant1Id String
  participant2Id String
  messages       ChatMessage[]
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

model ChatMessage {
  id          String   @id @default(uuid())
  chatId      String
  senderId    String
  message     String
  isRead      Boolean  @default(false)
  isDelivered Boolean  @default(false)
  readAt      DateTime?
  deliveredAt DateTime?
  createdAt   DateTime @default(now())
  chat        Chat     @relation(fields: [chatId], references: [id])
}
```

## Notifications

When a message is sent:
1. **WebSocket notification** is sent instantly to the receiver
2. **Database notification** is created for offline users
3. **Push notification** can be integrated for mobile apps

## Security

- JWT authentication required for WebSocket connections
- Token validation on connection
- User can only send messages in chats they're part of
- Messages are validated before saving

## Testing

### Test WebSocket Connection
```bash
# Install socket.io-client globally
npm install -g socket.io-client

# Test connection
node -e "const io = require('socket.io-client'); const socket = io('http://localhost:3000', { query: { token: 'your-token' } }); socket.on('connect', () => console.log('Connected!'));"
```

## Troubleshooting

### Connection Issues
- Verify JWT token is valid
- Check CORS settings
- Ensure WebSocket port is not blocked

### Messages Not Delivering
- Check both users are connected
- Verify chatId exists
- Check server logs for errors

## Performance Considerations

- WebSocket connections are lightweight
- Messages are persisted to database
- Offline messages are delivered when user reconnects
- Consider implementing message pagination for large chats
