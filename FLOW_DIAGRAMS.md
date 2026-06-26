# Real-Time Chat System Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐                        ┌──────────────┐       │
│  │  User Client │                        │  Specialist  │       │
│  │              │                        │    Client    │       │
│  │  - Web App   │                        │  - Web App   │       │
│  │  - Mobile    │                        │  - Mobile    │       │
│  └──────┬───────┘                        └──────┬───────┘       │
│         │                                       │               │
└─────────┼───────────────────────────────────────┼───────────────┘
          │                                       │
          │         WebSocket Connection          │
          │         (JWT Authenticated)           │
          │                                       │
┌─────────┼───────────────────────────────────────┼───────────────┐
│         │          Backend Server               │               │
├─────────┼───────────────────────────────────────┼───────────────┤
│         │                                       │               │
│         ▼                                       ▼               │
│  ┌──────────────────────────────────────────────────────┐      │
│  │           WebSocket Gateway Layer                     │      │
│  │                                                        │      │
│  │  ┌─────────────────┐      ┌─────────────────┐       │      │
│  │  │  App Gateway    │      │  Chat Gateway   │       │      │
│  │  │  (Main: /)      │      │  (Chat: /chat)  │       │      │
│  │  │                 │      │                 │       │      │
│  │  │ - Notifications │      │ - sendMessage   │       │      │
│  │  │ - newMessage    │      │ - typing        │       │      │
│  │  │ - userTyping    │      │ - markAsRead    │       │      │
│  │  │ - messageRead   │      │                 │       │      │
│  │  └────────┬────────┘      └────────┬────────┘       │      │
│  └───────────┼──────────────────────────┼───────────────┘      │
│              │                          │                       │
│              ▼                          ▼                       │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              Service Layer                            │      │
│  │                                                        │      │
│  │  ┌─────────────────┐      ┌─────────────────┐       │      │
│  │  │  Chat Service   │      │ Notification    │       │      │
│  │  │                 │◄────►│   Service       │       │      │
│  │  │ - sendMessage   │      │                 │       │      │
│  │  │ - getMessages   │      │ - create        │       │      │
│  │  │ - markAsRead    │      │ - notify        │       │      │
│  │  └────────┬────────┘      └─────────────────┘       │      │
│  └───────────┼───────────────────────────────────────────      │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │           Repository Layer                            │      │
│  │                                                        │      │
│  │  ┌─────────────────────────────────────────────┐     │      │
│  │  │      Chat Repository (Prisma)               │     │      │
│  │  │                                              │     │      │
│  │  │  - createChat()                             │     │      │
│  │  │  - addMessage()                             │     │      │
│  │  │  - getMessages()                            │     │      │
│  │  │  - markMessageAsRead()                      │     │      │
│  │  └────────┬────────────────────────────────────┘     │      │
│  └───────────┼───────────────────────────────────────────      │
│              │                                                  │
└──────────────┼──────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Database Layer                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────┐      ┌─────────────────────────────┐       │
│  │  Chat Table     │      │  ChatMessage Table          │       │
│  │                 │      │                             │       │
│  │  - id           │      │  - id                       │       │
│  │  - participant1 │◄────►│  - chatId                   │       │
│  │  - participant2 │      │  - senderId                 │       │
│  │  - createdAt    │      │  - message                  │       │
│  │  - updatedAt    │      │  - isRead                   │       │
│  └─────────────────┘      │  - isDelivered              │       │
│                            │  - readAt                   │       │
│                            │  - deliveredAt              │       │
│                            │  - createdAt                │       │
│                            └─────────────────────────────┘       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Message Flow: User → Specialist

```
┌──────────────┐                                      ┌──────────────┐
│  User Client │                                      │  Specialist  │
│              │                                      │    Client    │
└──────┬───────┘                                      └──────┬───────┘
       │                                                     │
       │ 1. User types message                              │
       │    "Hello, I need help"                            │
       │                                                     │
       │ 2. chatSocket.emit('sendMessage', {                │
       │      chatId: 'abc123',                             │
       │      senderId: 'user-1',                           │
       │      message: 'Hello, I need help'                 │
       │    })                                               │
       │                                                     │
       ├────────────────────────────────────────────────────┤
       │                                                     │
       │              ┌──────────────────┐                  │
       │              │  Backend Server  │                  │
       │              │                  │                  │
       │              │ 3. Receive msg   │                  │
       │              │ 4. Validate      │                  │
       │              │ 5. Save to DB    │                  │
       │              │                  │                  │
       │              └────────┬─────────┘                  │
       │                       │                            │
       │ 6. messageSent ◄──────┤                            │
       │    confirmation        │                            │
       │                       │                            │
       │                       │ 7. Send to specialist      │
       │                       │    mainSocket.emit(        │
       │                       │      'newMessage', msg)    │
       │                       │                            │
       │                       └───────────────────────────►│
       │                                                     │
       │                                    8. Specialist    │
       │                                       receives msg  │
       │                                       INSTANTLY!    │
       │                                                     │
       │                                    9. UI updates    │
       │                                       with new msg  │
       │                                                     │
       │                       ┌──────────────────┐         │
       │                       │  Database        │         │
       │                       │                  │         │
       │                       │  Message saved   │         │
       │                       │  Notification    │         │
       │                       │  created         │         │
       │                       └──────────────────┘         │
       │                                                     │
```

## Message Flow: Specialist → User

```
┌──────────────┐                                      ┌──────────────┐
│  Specialist  │                                      │  User Client │
│    Client    │                                      │              │
└──────┬───────┘                                      └──────┬───────┘
       │                                                     │
       │ 1. Specialist types reply                          │
       │    "How can I help you?"                           │
       │                                                     │
       │ 2. chatSocket.emit('sendMessage', {                │
       │      chatId: 'abc123',                             │
       │      senderId: 'specialist-1',                     │
       │      message: 'How can I help you?'                │
       │    })                                               │
       │                                                     │
       ├────────────────────────────────────────────────────┤
       │                                                     │
       │              ┌──────────────────┐                  │
       │              │  Backend Server  │                  │
       │              │                  │                  │
       │              │ 3. Receive msg   │                  │
       │              │ 4. Validate      │                  │
       │              │ 5. Save to DB    │                  │
       │              │                  │                  │
       │              └────────┬─────────┘                  │
       │                       │                            │
       │ 6. messageSent ◄──────┤                            │
       │    confirmation        │                            │
       │                       │                            │
       │                       │ 7. Send to user            │
       │                       │    mainSocket.emit(        │
       │                       │      'newMessage', msg)    │
       │                       │                            │
       │                       └───────────────────────────►│
       │                                                     │
       │                                    8. User receives │
       │                                       msg INSTANTLY!│
       │                                                     │
       │                                    9. UI updates    │
       │                                       with new msg  │
       │                                                     │
```

## Typing Indicator Flow

```
User Client                Backend                Specialist Client
    │                         │                          │
    │ 1. User starts typing   │                          │
    │                         │                          │
    │ 2. emit('typing', {     │                          │
    │      isTyping: true     │                          │
    │    })                   │                          │
    │────────────────────────►│                          │
    │                         │                          │
    │                         │ 3. Forward to specialist │
    │                         │    emit('userTyping')    │
    │                         │─────────────────────────►│
    │                         │                          │
    │                         │              4. Show     │
    │                         │                 "User is │
    │                         │                  typing" │
    │                         │                          │
    │ 5. User stops typing    │                          │
    │    (3 seconds timeout)  │                          │
    │                         │                          │
    │ 6. emit('typing', {     │                          │
    │      isTyping: false    │                          │
    │    })                   │                          │
    │────────────────────────►│                          │
    │                         │                          │
    │                         │ 7. Forward to specialist │
    │                         │─────────────────────────►│
    │                         │                          │
    │                         │              8. Hide     │
    │                         │                 typing   │
    │                         │                 indicator│
```

## Read Receipt Flow

```
User Client                Backend                Specialist Client
    │                         │                          │
    │ 1. Specialist sends msg │                          │
    │◄────────────────────────┼──────────────────────────│
    │                         │                          │
    │ 2. User reads message   │                          │
    │                         │                          │
    │ 3. emit('markAsRead', { │                          │
    │      messageId: 'xyz'   │                          │
    │    })                   │                          │
    │────────────────────────►│                          │
    │                         │                          │
    │                         │ 4. Update DB             │
    │                         │    isRead = true         │
    │                         │    readAt = now()        │
    │                         │                          │
    │                         │ 5. Notify specialist     │
    │                         │    emit('messageRead')   │
    │                         │─────────────────────────►│
    │                         │                          │
    │                         │              6. Show ✓✓  │
    │                         │                 on msg   │
```

## Connection Flow

```
Client                     Backend                    Database
  │                           │                           │
  │ 1. Connect with JWT       │                           │
  │    io('url', {            │                           │
  │      query: { token }     │                           │
  │    })                     │                           │
  │──────────────────────────►│                           │
  │                           │                           │
  │                           │ 2. Validate JWT           │
  │                           │    jwtService.verify()    │
  │                           │                           │
  │                           │ 3. Extract userId         │
  │                           │    from token payload     │
  │                           │                           │
  │                           │ 4. Store connection       │
  │                           │    clients.set(userId,    │
  │                           │      socket)              │
  │                           │                           │
  │ 5. Connection success     │                           │
  │    'connect' event        │                           │
  │◄──────────────────────────│                           │
  │                           │                           │
  │ 6. Client is now online   │                           │
  │    and can send/receive   │                           │
  │    messages instantly     │                           │
  │                           │                           │
```

## Offline Message Delivery

```
Sender                     Backend                    Offline User
  │                           │                           │
  │ 1. Send message           │                           │
  │──────────────────────────►│                           │
  │                           │                           │
  │                           │ 2. Save to DB             │
  │                           │    (message persisted)    │
  │                           │                           │
  │                           │ 3. Try to send via        │
  │                           │    WebSocket              │
  │                           │    sendToUser(userId)     │
  │                           │                           │
  │                           │ 4. User offline           │
  │                           │    (no active connection) │
  │                           │                           │
  │                           │ 5. Create notification    │
  │                           │    in database            │
  │                           │                           │
  │ 6. Confirmation           │                           │
  │    "Message sent"         │                           │
  │◄──────────────────────────│                           │
  │                           │                           │
  │                           │                           │
  │                           │         Later...          │
  │                           │                           │
  │                           │                           │
  │                           │ 7. User comes online      │
  │                           │◄──────────────────────────│
  │                           │                           │
  │                           │ 8. Fetch unread messages  │
  │                           │    from database          │
  │                           │                           │
  │                           │ 9. Deliver messages       │
  │                           │─────────────────────────►│
  │                           │                           │
  │                           │            10. User sees  │
  │                           │                all missed │
  │                           │                messages   │
```

## Complete Chat Session

```
User                        Backend                     Specialist
 │                             │                             │
 │ 1. Connect                  │                             │
 │────────────────────────────►│                             │
 │                             │                             │
 │                             │◄────────────────────────────│
 │                             │         2. Connect          │
 │                             │                             │
 │ 3. "Hello"                  │                             │
 │────────────────────────────►│                             │
 │                             │                             │
 │                             │ 4. Save & Forward           │
 │                             │────────────────────────────►│
 │                             │                             │
 │                             │                             │ 5. Receives
 │                             │                             │    "Hello"
 │                             │                             │
 │                             │                             │ 6. Starts
 │                             │                             │    typing
 │                             │                             │
 │                             │◄────────────────────────────│
 │                             │    7. typing: true          │
 │                             │                             │
 │◄────────────────────────────│                             │
 │ 8. Shows "typing..."        │                             │
 │                             │                             │
 │                             │◄────────────────────────────│
 │                             │    9. "How can I help?"     │
 │                             │                             │
 │                             │ 10. Save & Forward          │
 │◄────────────────────────────│                             │
 │                             │                             │
 │ 11. Receives message        │                             │
 │                             │                             │
 │ 12. Reads message           │                             │
 │────────────────────────────►│                             │
 │    markAsRead               │                             │
 │                             │                             │
 │                             │ 13. Update & Notify         │
 │                             │────────────────────────────►│
 │                             │                             │
 │                             │                             │ 14. Shows ✓✓
 │                             │                             │
```

---

## Legend

- `│` - Connection/Flow line
- `►` - Direction of data flow
- `◄` - Response/Callback
- `┌─┐` - Component/System boundary
- `├─┤` - Layer separator

## Notes

1. All WebSocket communications are **bidirectional**
2. Messages are **persisted** to database before delivery
3. **JWT authentication** required for all connections
4. **Offline messages** are delivered when user reconnects
5. **Typing indicators** have 3-second timeout
6. **Read receipts** update in real-time
