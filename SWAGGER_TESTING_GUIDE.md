# Swagger UI Testing Guide

## 🚀 Access Swagger UI

Once your server is running, access Swagger UI at:
```
http://localhost:3000/api
```

---

## 📋 Available Endpoints in Swagger

### **Appointments Section**

All appointment endpoints are now fully documented in Swagger UI with:
- ✅ Detailed descriptions
- ✅ Request/response examples
- ✅ All possible status codes
- ✅ Authorization requirements
- ✅ Try it out functionality

---

## 🔐 Authentication in Swagger

### Step 1: Login
1. Go to **Auth** section in Swagger
2. Use `POST /auth/login` (or `/auth/admin/login` or `/auth/specialist/login`)
3. Copy the `accessToken` from response

### Step 2: Authorize
1. Click the **🔒 Authorize** button at the top right
2. Enter: `Bearer YOUR_ACCESS_TOKEN`
3. Click **Authorize**
4. Click **Close**

Now all endpoints will include your auth token!

---

## 📝 Endpoint Descriptions

### 1. **POST /appointments**
**Description**: Create a new appointment
**Auth**: User token required
**What it does**:
- Validates subscription eligibility
- Creates appointment with PENDING status
- Creates transaction for payment
- Notifies admins

**Try it**:
```json
{
  "subscriptionId": "your_subscription_id",
  "specialty": "DERMATOLOGIST",
  "scheduledAt": "2024-02-15T10:00:00Z",
  "notes": "Skin consultation"
}
```

---

### 2. **GET /appointments/eligibility**
**Description**: Check if you can book an appointment
**Auth**: User token required
**What it does**:
- Checks active subscription
- Validates duration and sessions
- Returns eligibility status

**Response Example**:
```json
{
  "eligible": true,
  "daysRemaining": 25,
  "remainingSessions": 5
}
```

---

### 3. **GET /appointments**
**Description**: Get my appointments
**Auth**: User token required
**What it does**: Returns all appointments for authenticated user

---

### 4. **GET /appointments/all**
**Description**: Get all appointments (Admin)
**Auth**: Any authenticated user
**What it does**: Returns all appointments in system

---

### 5. **POST /appointments/:id/assign-specialists**
**Description**: Assign specialists to appointment
**Auth**: OPERATIONS_ADMIN or SUPER_ADMIN required
**What it does**:
- Assigns multiple specialists
- Notifies all specialists
- Notifies user

**Try it**:
```json
{
  "specialistIds": ["specialist_1", "specialist_2", "specialist_3"]
}
```

---

### 6. **GET /appointments/assignments/me**
**Description**: Get my specialist assignments
**Auth**: Specialist token required
**What it does**: Returns all assignments for authenticated specialist

**Response includes**:
- Assignment status
- Appointment details
- Patient information
- Specialty and scheduled time

---

### 7. **POST /appointments/assignments/:assignmentId/accept**
**Description**: Accept specialist assignment
**Auth**: Specialist token required
**What it does**:
- Accepts assignment
- Confirms appointment
- Cancels other assignments
- Notifies user with specialist details
- Notifies other specialists

---

### 8. **POST /appointments/assignments/:assignmentId/decline**
**Description**: Decline specialist assignment
**Auth**: Specialist token required
**What it does**: Declines assignment, keeps appointment available for others

---

### 9. **PUT /appointments/:id/complete**
**Description**: Mark appointment as completed
**Auth**: User or Specialist token required
**What it does**:
- Marks appointment as COMPLETED
- Increments specialist's completed count
- Notifies both parties

---

### 10. **PUT /appointments/:id/schedule**
**Description**: Schedule appointment
**Auth**: Authenticated user
**What it does**: Sets or updates scheduled date/time

**Try it**:
```json
{
  "scheduledAt": "2024-02-15T10:00:00Z",
  "notes": "Updated notes"
}
```

---

### 11. **PUT /appointments/:id/status**
**Description**: Update appointment status
**Auth**: Authenticated user
**What it does**: Changes appointment status

**Try it**:
```json
{
  "status": "CONFIRMED"
}
```

**Valid statuses**: PENDING, CONFIRMED, COMPLETED, CANCELLED

---

## 🧪 Testing Workflow in Swagger

### **Scenario 1: User Books Appointment**

1. **Login as User**
   - `POST /auth/login`
   - Authorize with token

2. **Check Eligibility**
   - `GET /appointments/eligibility`
   - Verify `eligible: true`

3. **Create Appointment**
   - `POST /appointments`
   - Provide subscriptionId and details

4. **View My Appointments**
   - `GET /appointments`
   - See newly created appointment

---

### **Scenario 2: Admin Assigns Specialists**

1. **Login as Admin**
   - `POST /auth/admin/login`
   - Authorize with admin token

2. **View All Appointments**
   - `GET /appointments/all`
   - Find pending appointment

3. **Assign Specialists**
   - `POST /appointments/{id}/assign-specialists`
   - Provide array of specialist IDs

---

### **Scenario 3: Specialist Accepts Assignment**

1. **Login as Specialist**
   - `POST /auth/specialist/login`
   - Authorize with specialist token

2. **View My Assignments**
   - `GET /appointments/assignments/me`
   - See pending assignments

3. **Accept Assignment**
   - `POST /appointments/assignments/{assignmentId}/accept`
   - Assignment accepted, appointment confirmed

---

### **Scenario 4: Complete Appointment**

1. **Login as User or Specialist**
   - Use appropriate login endpoint
   - Authorize with token

2. **Complete Appointment**
   - `PUT /appointments/{id}/complete`
   - Appointment marked as completed

3. **Verify Specialist Stats** (if specialist)
   - `GET /specialists/me`
   - See `completedAppointments` incremented

---

## 🎨 Swagger UI Features

### **Try It Out**
1. Click **Try it out** button
2. Fill in parameters
3. Click **Execute**
4. See response below

### **Response Codes**
Each endpoint shows all possible responses:
- ✅ 200/201 - Success
- ❌ 400 - Bad Request
- ❌ 401 - Unauthorized
- ❌ 403 - Forbidden
- ❌ 404 - Not Found

### **Schemas**
Click on **Schemas** at the bottom to see:
- CreateAppointmentDto
- AssignSpecialistsDto
- SubscriptionEligibilityDto
- Appointment entity
- And more...

---

## 💡 Tips

1. **Always Authorize First**: Click 🔒 Authorize before testing
2. **Copy IDs**: Copy IDs from responses to use in other requests
3. **Check Responses**: Review response examples for expected format
4. **Test Error Cases**: Try invalid data to see error responses
5. **Use Descriptions**: Read endpoint descriptions for context

---

## 🔍 Common Testing Scenarios

### Test Eligibility Check
```
1. GET /appointments/eligibility
2. Should return eligibility status
3. If not eligible, shows reason
```

### Test Multi-Specialist Assignment
```
1. POST /appointments/{id}/assign-specialists
2. Body: { "specialistIds": ["id1", "id2", "id3"] }
3. All 3 specialists get notified
4. First to accept gets appointment
```

### Test Race Condition
```
1. Assign 3 specialists
2. Have 2 specialists try to accept simultaneously
3. First one succeeds
4. Second gets "already responded" error
```

### Test Completion Tracking
```
1. Complete appointment as specialist
2. GET /specialists/{specialistId}
3. Verify completedAppointments incremented
```

---

## 📊 Response Examples

### Success Response
```json
{
  "id": "appt_123",
  "userId": "user_456",
  "status": "PENDING",
  "specialty": "DERMATOLOGIST",
  "price": 5000,
  "createdAt": "2024-02-08T20:00:00Z"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "No active subscription found. Please subscribe to a plan first.",
  "error": "Bad Request"
}
```

---

## 🚀 Quick Start

1. Start server: `npm run start:dev`
2. Open browser: `http://localhost:3000/api`
3. Click **Authorize** button
4. Login and get token
5. Paste token in authorization
6. Start testing endpoints!

---

**All endpoints are now fully documented and testable in Swagger UI! 🎉**
