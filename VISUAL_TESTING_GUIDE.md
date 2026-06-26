# Visual Testing Guide - Real-Time Chat

## 🎯 Goal
Test that messages appear INSTANTLY between two users in real-time.

---

## 📸 Step-by-Step Visual Guide

### STEP 1: Start Your Backend

**What to do:**
```bash
cd c:\Development\AfriDamAi-Backend
npm run start:dev
```

**What you should see:**
```
[Nest] 12345  - 01/20/2025, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 01/20/2025, 10:30:01 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 01/20/2025, 10:30:01 AM     LOG [RoutesResolver] ChatController {/chats}
[Nest] 12345  - 01/20/2025, 10:30:01 AM     LOG [NestApplication] Nest application successfully started
[Nest] 12345  - 01/20/2025, 10:30:01 AM     LOG Application is running on: http://localhost:3000
```

✅ **Success indicator:** "Application is running on: http://localhost:3000"

---

### STEP 2: Get JWT Tokens

**Option A - Use Postman/Insomnia:**
1. Create POST request to `http://localhost:3000/auth/login`
2. Body (JSON):
   ```json
   {
     "email": "user1@test.com",
     "password": "yourpassword"
   }
   ```
3. Send request
4. Copy the `accessToken` from response

**Option B - Use Command Line:**
```bash
curl -X POST http://localhost:3000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"user1@test.com\",\"password\":\"password123\"}"
```

**What you should see:**
```json
{
  "succeeded": true,
  "message": "Login successful",
  "resultData": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // <-- COPY THIS
    "user": {
      "id": "user-123-abc",  // <-- ALSO COPY THIS (User ID)
      "email": "user1@test.com"
    }
  }
}
```

**Repeat for User 2** to get a second token and user ID.

✅ **You should now have:**
- User 1 Token: `eyJhbGc...`
- User 1 ID: `user-123-abc`
- User 2 Token: `eyJhbGc...`
- User 2 ID: `user-456-def`

---

### STEP 3: Create a Chat

**Using Command Line:**
```bash
curl -X POST http://localhost:3000/chats ^
  -H "Authorization: Bearer YOUR_USER1_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"participant1Id\":\"user-123-abc\",\"participant2Id\":\"user-456-def\"}"
```

**What you should see:**
```json
{
  "succeeded": true,
  "message": "Chat initiated successfully",
  "resultData": {
    "id": "chat-789-xyz",  // <-- COPY THIS CHAT ID!
    "participant1Id": "user-123-abc",
    "participant2Id": "user-456-def",
    "createdAt": "2025-01-20T10:35:00.000Z"
  }
}
```

✅ **Copy the chat ID:** `chat-789-xyz`

---

### STEP 4: Open Test Client - Window 1

**What to do:**
1. Navigate to: `c:\Development\AfriDamAi-Backend\test-chat-client.html`
2. Double-click to open in browser

**What you should see:**
```
┌─────────────────────────────────────────────────────────┐
│         Real-Time Chat Test Client                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Configuration                                           │
│  ┌────────────────────────────────────────────────┐    │
│  │ Backend URL: [http://localhost:3000          ] │    │
│  │ JWT Token:   [                               ] │    │
│  │ Chat ID:     [                               ] │    │
│  │ User ID:     [                               ] │    │
│  │ [Connect]  [Disconnect]                        │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Status: Disconnected (RED)                             │
│                                                          │
│  Messages                                                │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│  [                                    ] [Send]          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Fill in the form:**
1. Backend URL: `http://localhost:3000` (already filled)
2. JWT Token: Paste User 1's token
3. Chat ID: Paste the chat ID from Step 3
4. User ID: Paste User 1's ID

**Click "Connect"**

**What you should see after connecting:**
```
┌─────────────────────────────────────────────────────────┐
│  Status: Connected (GREEN) ✅                           │
│                                                          │
│  Event Log                                               │
│  ┌────────────────────────────────────────────────┐    │
│  │ [10:40:00] Chat test client loaded             │    │
│  │ [10:40:15] Connected to main gateway           │    │
│  │ [10:40:15] Connected to chat namespace         │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

✅ **Success indicators:**
- Status is GREEN and says "Connected"
- Event log shows "Connected to main gateway"
- Event log shows "Connected to chat namespace"

---

### STEP 5: Open Test Client - Window 2

**What to do:**
1. Open a NEW browser window (or incognito/private window)
2. Navigate to the same file: `test-chat-client.html`

**Fill in the form with User 2's details:**
1. Backend URL: `http://localhost:3000`
2. JWT Token: Paste User 2's token
3. Chat ID: **SAME chat ID as Window 1**
4. User ID: Paste User 2's ID

**Click "Connect"**

**Now you should have TWO windows side by side:**
```
Window 1 (User 1)              Window 2 (User 2)
┌──────────────────┐          ┌──────────────────┐
│ Status: Connected│          │ Status: Connected│
│ (GREEN) ✅       │          │ (GREEN) ✅       │
└──────────────────┘          └──────────────────┘
```

✅ **Both windows should show "Connected" in GREEN**

---

### STEP 6: Send Your First Message

**In Window 1 (User 1):**
1. Click in the message input box
2. Type: `Hello from User 1!`
3. Click "Send" (or press Enter)

**What happens in Window 1:**
```
┌─────────────────────────────────────────────────────────┐
│  Messages                                                │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  │                              You - 10:45:00     │    │
│  │                     Hello from User 1!          │    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Event Log                                               │
│  ┌────────────────────────────────────────────────┐    │
│  │ [10:45:00] Sending message: "Hello from User 1!"│    │
│  │ [10:45:00] Message sent confirmation received   │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

**What happens in Window 2 (INSTANTLY!):**
```
┌─────────────────────────────────────────────────────────┐
│  Messages                                                │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  │ Other User - 10:45:00                          │    │
│  │ Hello from User 1!                             │    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Event Log                                               │
│  ┌────────────────────────────────────────────────┐    │
│  │ [10:45:00] Received new message via WebSocket  │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

✅ **Success indicators:**
- Message appears in Window 1 on the RIGHT (green background)
- Message appears in Window 2 on the LEFT (white background)
- Message appears INSTANTLY (within 1 second)
- Event logs show the activity

---

### STEP 7: Reply from User 2

**In Window 2 (User 2):**
1. Type: `Hi! I got your message instantly!`
2. Click "Send"

**Now both windows show the conversation:**

**Window 1:**
```
┌────────────────────────────────────────────────┐
│ Other User - 10:45:00                          │
│ Hello from User 1!                             │ <-- Sent by you
│                                                 │
│                              You - 10:45:05     │
│                     Hi! I got your message...   │ <-- Reply received
└────────────────────────────────────────────────┘
```

**Window 2:**
```
┌────────────────────────────────────────────────┐
│ Other User - 10:45:00                          │
│ Hello from User 1!                             │ <-- Received
│                                                 │
│                              You - 10:45:05     │
│                     Hi! I got your message...   │ <-- Sent by you
└────────────────────────────────────────────────┘
```

✅ **Success! Real-time bidirectional chat is working!**

---

### STEP 8: Test Typing Indicator

**In Window 1:**
1. Click in the message input
2. Start typing (don't send yet)

**In Window 2, you should see:**
```
┌────────────────────────────────────────────────┐
│ Messages...                                     │
│                                                 │
│ User is typing... ⌨️                           │
└────────────────────────────────────────────────┘
```

**Stop typing for 3 seconds**

**The typing indicator disappears!**

✅ **Typing indicators work!**

---

### STEP 9: Check Backend Logs

**In your backend terminal, you should see:**
```
[AppGateway] Client connected: socket-abc-123
[AppGateway] Client socket-abc-123 connected as User ID: user-123-abc, Role: user
[AppGateway] Client connected: socket-def-456
[AppGateway] Client socket-def-456 connected as User ID: user-456-def, Role: user
[ChatService] Real-time message delivered to user-456-def for chat chat-789-xyz
[ChatService] Database notification created for user-456-def
[ChatService] Real-time message delivered to user-123-abc for chat chat-789-xyz
[ChatService] Database notification created for user-123-abc
```

✅ **Backend is processing messages correctly!**

---

## 🎉 SUCCESS CHECKLIST

If you see all of these, your chat is working perfectly:

- [x] Both windows show "Connected" (green)
- [x] Messages appear instantly in the other window
- [x] Messages appear on correct side (sent vs received)
- [x] Typing indicator works
- [x] Event logs show all activities
- [x] Backend logs show message delivery
- [x] No errors in browser console (F12)
- [x] No errors in backend console

---

## 🚀 You're Ready!

Your real-time chat system is working locally! You can now:

1. ✅ Push to cloud
2. ✅ Integrate with your frontend
3. ✅ Deploy to production

---

## 🐛 If Something Doesn't Work

### Check Browser Console (F12)
Press F12 in browser and look for errors in the Console tab

### Check Backend Console
Look at the terminal where you ran `npm run start:dev`

### Common Issues:

**"Disconnected" status:**
- Backend not running → Start it with `npm run start:dev`
- Wrong backend URL → Use `http://localhost:3000`
- Invalid JWT token → Get a fresh token

**Messages not appearing:**
- Different chat IDs → Use the SAME chat ID in both windows
- Same user ID → Use DIFFERENT user IDs in each window
- Not connected → Both windows must show "Connected"

**"Chat not found" error:**
- Create a chat first using Step 3
- Use the correct chat ID

---

## 📚 Next Steps

1. Read `QUICK_START_CHAT.md` for frontend integration
2. Check `REALTIME_CHAT_GUIDE.md` for complete docs
3. Review `IMPLEMENTATION_SUMMARY.md` for overview

---

**Congratulations! Your real-time chat is working! 🎉**
