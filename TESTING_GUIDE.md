# Quick Testing Guide - Appointment Booking Validation

## Prerequisites
1. User must be authenticated (JWT token)
2. User must have an active subscription
3. Backend server running on port 3000

---

## Test 1: Check Eligibility ✅

### Request
```bash
curl -X GET http://localhost:3000/appointments/eligibility \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Expected Responses

**Success (Eligible)**:
```json
{
  "eligible": true,
  "daysRemaining": 25,
  "remainingSessions": 5
}
```

**Failure (No Subscription)**:
```json
{
  "eligible": false,
  "reason": "No active subscription found. Please subscribe to a plan first."
}
```

**Failure (Expired)**:
```json
{
  "eligible": false,
  "reason": "Your subscription has expired. Please renew to book appointments.",
  "daysRemaining": 0
}
```

**Failure (No Sessions)**:
```json
{
  "eligible": false,
  "reason": "You have no remaining appointment slots in your subscription."
}
```

---

## Test 2: Book Appointment ✅

### Request
```bash
curl -X POST http://localhost:3000/appointments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": "YOUR_SUBSCRIPTION_ID",
    "specialty": "DERMATOLOGIST",
    "scheduledAt": "2024-02-15T10:00:00Z",
    "notes": "Skin consultation"
  }'
```

### Expected Responses

**Success**:
```json
{
  "id": "clx456abc...",
  "userId": "clx789def...",
  "subscriptionId": "clx123ghi...",
  "specialty": "DERMATOLOGIST",
  "type": "PREMIUM_PLAN",
  "status": "PENDING",
  "price": 5000,
  "scheduledAt": "2024-02-15T10:00:00.000Z",
  "notes": "Skin consultation",
  "createdAt": "2024-02-06T12:00:00.000Z",
  "updatedAt": "2024-02-06T12:00:00.000Z",
  "transactionId": "clx999jkl...",
  "checkoutUrl": "/api/transactions/pay/clx999jkl..."
}
```

**Failure (Not Eligible)**:
```json
{
  "statusCode": 400,
  "message": "Your subscription has expired. Please renew to book appointments.",
  "error": "Bad Request"
}
```

---

## Test 3: Verify Admin Notification 🔔

### Steps
1. Book an appointment (Test 2)
2. Login as OPERATIONS_ADMIN or SUPER_ADMIN
3. Check notifications endpoint

### Request
```bash
curl -X GET http://localhost:3000/notifications \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### Expected Response
```json
[
  {
    "id": "clx111...",
    "adminId": "admin123",
    "title": "New Appointment Request",
    "message": "User clx789def... has booked a new appointment with ID: clx456abc.... Please assign a specialist.",
    "isRead": false,
    "createdAt": "2024-02-06T12:00:00.000Z"
  }
]
```

---

## Test 4: Instant Session Plan 🚀

### Scenario
User has instant session subscription

### First Booking (Should Succeed)
```bash
curl -X POST http://localhost:3000/appointments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": "INSTANT_SESSION_SUB_ID",
    "specialty": "CONSULTANT",
    "notes": "Quick consultation"
  }'
```

**Expected**: ✅ Appointment created, subscription status → EXPIRED

### Second Booking (Should Fail)
```bash
# Same request as above
```

**Expected**: ❌ "No active subscription found. Please subscribe to a plan first."

---

## Test 5: Session Decrement 📉

### Initial State
```
Subscription: { remainingSessions: 3 }
```

### Book Appointment
```bash
curl -X POST http://localhost:3000/appointments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": "YOUR_SUB_ID",
    "specialty": "DERMATOLOGIST"
  }'
```

### Verify Decrement
```bash
curl -X GET http://localhost:3000/subscriptions/YOUR_SUB_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**:
```json
{
  "id": "YOUR_SUB_ID",
  "remainingSessions": 2,  // Decremented from 3
  "status": "ACTIVE"
}
```

---

## Test 6: Cron Job - Auto Expiry ⏰

### Manual Trigger (For Testing)
Add this method to `SubscriptionCronService`:

```typescript
@Get('test-cron')
async testCron() {
  await this.subscriptionCronService.handleSubscriptionExpiry();
  return { message: 'Cron job executed' };
}
```

### Verify Expired Subscriptions
```bash
# Check subscriptions with past endDate
curl -X GET http://localhost:3000/subscriptions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: Subscriptions with `endDate < today` should have `status: "EXPIRED"`

---

## Test 7: Duration Expiry 📅

### Setup
1. Create subscription with `endDate` in the past
2. Try to book appointment

### Request
```bash
curl -X POST http://localhost:3000/appointments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": "EXPIRED_SUB_ID",
    "specialty": "DERMATOLOGIST"
  }'
```

**Expected**: ❌ "Your subscription has expired. Please renew to book appointments."

---

## Test 8: No Sessions Remaining 🚫

### Setup
1. Subscription with `remainingSessions: 0`
2. Try to book appointment

### Request
```bash
curl -X POST http://localhost:3000/appointments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": "NO_SESSIONS_SUB_ID",
    "specialty": "DERMATOLOGIST"
  }'
```

**Expected**: ❌ "You have no remaining appointment slots in your subscription."

---

## Database Verification Queries

### Check Subscription Status
```sql
SELECT 
  id, 
  userId, 
  status, 
  remainingSessions, 
  endDate,
  CASE 
    WHEN endDate < NOW() THEN 'EXPIRED (Date)'
    WHEN remainingSessions = 0 THEN 'EXPIRED (Sessions)'
    ELSE 'ACTIVE'
  END as calculated_status
FROM "UserSubscription"
WHERE userId = 'USER_ID';
```

### Check User's Current Plan
```sql
SELECT 
  u.id,
  u.email,
  u.currentPricingPlanId,
  pp.name as plan_name,
  pp.durationDays,
  pp.appointmentLimit,
  pp.isInstantSession
FROM "User" u
LEFT JOIN "PricingPlan" pp ON u.currentPricingPlanId = pp.id
WHERE u.id = 'USER_ID';
```

### Check Admin Notifications
```sql
SELECT 
  n.id,
  n.title,
  n.message,
  n.isRead,
  n.createdAt,
  a.email as admin_email,
  a.type as admin_type
FROM "Notification" n
JOIN "Admin" a ON n.adminId = a.id
WHERE n.title LIKE '%Appointment%'
ORDER BY n.createdAt DESC
LIMIT 10;
```

---

## Common Issues & Solutions

### Issue 1: "No active subscription found"
**Solution**: 
1. Check if user has subscription: `GET /subscriptions`
2. Verify subscription status is ACTIVE
3. Check if subscription has expired

### Issue 2: Admin not receiving notifications
**Solution**:
1. Verify admin type is OPERATIONS_ADMIN or SUPER_ADMIN
2. Check admin isActive = true
3. Verify WebSocket connection

### Issue 3: Cron job not running
**Solution**:
1. Check if @nestjs/schedule is installed
2. Verify ScheduleModule is imported in AppModule
3. Check server logs for cron execution

### Issue 4: Sessions not decrementing
**Solution**:
1. Verify plan has appointmentLimit set
2. Check if subscription has remainingSessions
3. Review appointment creation logs

---

## Postman Collection

Import this collection for easy testing:

```json
{
  "info": {
    "name": "Appointment Booking Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Check Eligibility",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": "{{baseUrl}}/appointments/eligibility"
      }
    },
    {
      "name": "Book Appointment",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"subscriptionId\": \"{{subscriptionId}}\",\n  \"specialty\": \"DERMATOLOGIST\",\n  \"notes\": \"Test booking\"\n}"
        },
        "url": "{{baseUrl}}/appointments"
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "token",
      "value": "YOUR_JWT_TOKEN"
    },
    {
      "key": "subscriptionId",
      "value": "YOUR_SUBSCRIPTION_ID"
    }
  ]
}
```

---

## Success Criteria ✅

- [ ] User with valid subscription can book appointment
- [ ] User without subscription cannot book
- [ ] Expired subscription (duration) blocks booking
- [ ] Zero sessions blocks booking
- [ ] Instant session works once then expires
- [ ] Sessions decrement after booking
- [ ] Operations admins receive notifications
- [ ] Cron job expires subscriptions daily
- [ ] Eligibility endpoint returns correct status
- [ ] All error messages are clear and helpful

---

**Happy Testing! 🚀**
