# Quick Test Reference Card

## 🚀 5-Minute Test Guide

### Step 1: Start Backend (1 min)
```bash
cd c:\Development\AfriDamAi-Backend
npm run start:dev
```
Wait for: `Application is running on: http://localhost:3000`

### Step 2: Get Tokens (1 min)
Login two users and copy their JWT tokens:
```bash
# Windows Command Prompt
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"user1@test.com\",\"password\":\"password\"}"
```
**Copy the `accessToken`**

### Step 3: Create Chat (30 sec)
```bash
curl -X POST http://localhost:3000/chats -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d "{\"participant1Id\":\"USER1_ID\",\"participant2Id\":\"USER2_ID\"}"
```
**Copy the chat `id`**

### Step 4: Open Test Client (30 sec)
1. Double-click `test-chat-client.html`
2. Fill in:
   - Backend URL: `http://localhost:3000`
   - JWT Token: (paste token)
   - Chat ID: (paste chat id)
   - User ID: (your user id)
3. Click **Connect**

### Step 5: Open Second Window (30 sec)
1. Open NEW browser window
2. Open `test-chat-client.html` again
3. Fill in with User 2's details
4. Click **Connect**

### Step 6: Test! (1 min)
- Type in Window 1 → See in Window 2 INSTANTLY ✅
- Type in Window 2 → See in Window 1 INSTANTLY ✅

---

## 📋 Checklist

Before testing:
- [ ] Backend running on port 3000
- [ ] Have 2 JWT tokens ready
- [ ] Have 2 user IDs ready
- [ ] Created a chat and have chat ID

During testing:
- [ ] Both windows show "Connected" (green)
- [ ] Messages appear instantly
- [ ] Typing indicator works
- [ ] No errors in console (F12)

---

## 🔧 Quick Commands

### Get User ID from Token
Decode your JWT at https://jwt.io and look for `sub` field

### Check if Backend is Running
Open browser: http://localhost:3000

### View Backend Logs
Check the terminal where you ran `npm run start:dev`

### Check Database
```sql
SELECT * FROM "ChatMessage" ORDER BY "createdAt" DESC LIMIT 10;
```

---

## ⚡ Super Quick Test (No UI)

Open browser console (F12) and paste:

```javascript
// Connect
const socket = io('http://localhost:3000', { 
  query: { token: 'YOUR_TOKEN' } 
});

// Listen
socket.on('connect', () => console.log('✅ Connected'));
socket.on('newMessage', (msg) => console.log('📨', msg));

// Send (in chat namespace)
const chat = io('http://localhost:3000/chat', { 
  query: { token: 'YOUR_TOKEN' } 
});

chat.emit('sendMessage', {
  chatId: 'CHAT_ID',
  senderId: 'USER_ID',
  message: 'Test!'
});
```

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Can't connect | Check backend is running |
| "No token" error | Paste valid JWT token |
| Messages not appearing | Use same chat ID in both windows |
| "Chat not found" | Create chat first (Step 3) |

---

## 📞 What Success Looks Like

```
Window 1                          Window 2
┌─────────────────┐              ┌─────────────────┐
│ Status: Connected│              │ Status: Connected│
│ (GREEN)          │              │ (GREEN)          │
├─────────────────┤              ├─────────────────┤
│                  │              │                  │
│ Other User       │              │                  │
│ Hello!           │              │                  │
│                  │              │                  │
│         You      │              │         You      │
│         Hi there!│              │         Hi there!│
│              ✓✓  │              │              ✓✓  │
│                  │              │ Other User       │
│                  │              │ Hello!           │
└─────────────────┘              └─────────────────┘
     Type here...                     Type here...
```

Messages appear INSTANTLY in both windows!

---

## 🎯 Expected Backend Logs

```
[AppGateway] Client connected: abc123
[AppGateway] Client abc123 connected as User ID: user-1, Role: user
[ChatGateway] Handling sendMessage event
[ChatService] Real-time message delivered to user-2 for chat xyz789
[ChatService] Database notification created for user-2
```

---

## ✅ You're Ready When...

- ✅ Both windows connected
- ✅ Messages appear instantly (< 1 second)
- ✅ Typing indicator works
- ✅ Backend logs show delivery
- ✅ Messages saved in database

**Then you can push to cloud! 🚀**

---

## 📚 Full Documentation

- `TESTING_GUIDE.md` - Detailed testing steps
- `QUICK_START_CHAT.md` - Integration guide
- `REALTIME_CHAT_GUIDE.md` - Complete docs
- `SETUP_CHECKLIST.md` - Setup verification

---

**Need help? Check backend console and browser console (F12) for errors.**
