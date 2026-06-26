# Appointment Booking Validation Implementation

## Overview
This implementation adds comprehensive subscription validation for appointment booking with the following business rules:

### Business Rules Implemented

1. **Active Subscription Required**: Users must have an active subscription to book appointments
2. **Duration Validation**: Subscriptions with expired duration (days remaining = 0) cannot book appointments
3. **Appointment Limit Validation**: Subscriptions with no remaining sessions cannot book appointments
4. **Instant Session Logic**: Instant session plans allow one booking, then automatically expire
5. **Admin Notifications**: Operations admins are notified when appointments are created

---

## Files Created

### 1. `src/domain/services/subscription-validation.service.ts`
**Purpose**: Centralized validation logic for subscription eligibility

**Key Methods**:
- `validateSubscriptionForAppointment(userId)`: Validates if user can book appointment
- `calculateDaysRemaining(endDate)`: Calculates remaining days in subscription

**Validation Flow**:
```typescript
1. Check if user has active subscription → Reject if none
2. Verify subscription status is ACTIVE → Reject if not
3. Verify pricing plan is active → Reject if not
4. Calculate days remaining from endDate → Reject if ≤ 0
5. Check remaining sessions → Reject if = 0
6. Handle instant session logic → Allow once
7. Return eligibility status
```

### 2. `src/application/DTOs/appointments/subscription-eligibility.dto.ts`
**Purpose**: Response DTO for eligibility checks

**Fields**:
- `eligible`: boolean
- `reason`: string (optional)
- `daysRemaining`: number (optional)
- `remainingSessions`: number (optional)

---

## Files Modified

### 1. `src/domain/services/appointment.service.ts`
**Changes**:
- Added `SubscriptionValidationService` injection
- Updated `createAppointment()` to validate eligibility before booking
- Implemented instant session auto-expiry after booking
- Added `notifyOperationsAdmins()` helper method
- Filtered admin notifications to OPERATIONS_ADMIN and SUPER_ADMIN only

**New Flow**:
```typescript
createAppointment():
  1. Validate subscription eligibility
  2. Throw BadRequestException if not eligible
  3. Handle instant session (expire after booking)
  4. Decrement remaining sessions for limited plans
  5. Create appointment
  6. Create transaction
  7. Notify operations admins
  8. Return appointment with transaction details
```

### 2. `src/domain/services/subscription-cron.service.ts`
**Changes**:
- Enhanced to expire subscriptions when `remainingSessions = 0`
- Expires subscriptions when `endDate` has passed
- Sets `currentPricingPlanId` to null for affected users

**Cron Schedule**: Runs daily at midnight

### 3. `src/API/modules/appointment.module.ts`
**Changes**:
- Added `SubscriptionValidationService` to providers

### 4. `src/API/controllers/appointment.controller.ts`
**Changes**:
- Added `SubscriptionValidationService` injection
- Added new endpoint: `GET /appointments/eligibility`

---

## API Endpoints

### New Endpoint: Check Eligibility
```http
GET /appointments/eligibility
Authorization: Bearer <token>
```

**Response**:
```json
{
  "eligible": true,
  "daysRemaining": 25,
  "remainingSessions": 5
}
```

**Error Response**:
```json
{
  "eligible": false,
  "reason": "Your subscription has expired. Please renew to book appointments.",
  "daysRemaining": 0
}
```

### Updated Endpoint: Create Appointment
```http
POST /appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "subscriptionId": "clx123...",
  "specialty": "DERMATOLOGIST",
  "scheduledAt": "2024-02-15T10:00:00Z",
  "notes": "Skin consultation"
}
```

**Success Response**:
```json
{
  "id": "clx456...",
  "userId": "clx789...",
  "subscriptionId": "clx123...",
  "specialty": "DERMATOLOGIST",
  "status": "PENDING",
  "price": 5000,
  "transactionId": "clx999...",
  "checkoutUrl": "/api/transactions/pay/clx999..."
}
```

**Error Responses**:
```json
// No subscription
{
  "statusCode": 400,
  "message": "No active subscription found. Please subscribe to a plan first."
}

// Expired subscription
{
  "statusCode": 400,
  "message": "Your subscription has expired. Please renew to book appointments."
}

// No remaining sessions
{
  "statusCode": 400,
  "message": "You have no remaining appointment slots in your subscription."
}
```

---

## Validation Logic Details

### Duration-Based Plans
```typescript
// Example: 30-day subscription
Plan: { durationDays: 30 }
Subscription: { startDate: "2024-01-01", endDate: "2024-01-31" }

Validation:
- Calculate: daysRemaining = endDate - today
- If daysRemaining <= 0 → REJECT
- Else → ALLOW (if other conditions pass)
```

### Appointment-Limited Plans
```typescript
// Example: 10 appointments plan
Plan: { appointmentLimit: 10 }
Subscription: { remainingSessions: 3 }

Validation:
- If remainingSessions <= 0 → REJECT
- Else → ALLOW and decrement remainingSessions
```

### Instant Session Plans
```typescript
// Example: One-time consultation
Plan: { isInstantSession: true }
Subscription: { status: "ACTIVE" }

Validation:
- Allow booking once
- After booking → Set subscription status to EXPIRED
- Future bookings → REJECT (no active subscription)
```

---

## Admin Notification System

### Who Gets Notified
- Admins with type: `OPERATIONS_ADMIN`
- Admins with type: `SUPER_ADMIN`
- Only active admins (`isActive = true`)

### Notification Events
1. **New Appointment Created** (PENDING status)
   - Title: "New Appointment Request"
   - Message: "User {userId} has booked a new appointment with ID: {appointmentId}. Please assign a specialist."

2. **Appointment Confirmed**
   - Title: "Appointment Confirmed!"
   - Message: "Appointment ID: {appointmentId} has been confirmed and scheduled."

3. **Appointment Scheduled**
   - Title: "Appointment Scheduled!"
   - Message: "Appointment ID: {appointmentId} has been scheduled for {scheduledAt}."

### Notification Channels
- Database notification (via NotificationService)
- Real-time WebSocket notification (via AppGateway)

---

## Cron Job: Auto-Expiry

### Schedule
Runs daily at midnight (`CronExpression.EVERY_DAY_AT_MIDNIGHT`)

### Actions
1. Find subscriptions with `endDate < now` and status = ACTIVE
2. Find subscriptions with `remainingSessions = 0` and status = ACTIVE
3. Update all found subscriptions to status = EXPIRED
4. Set `autoRenew = false` for expired subscriptions
5. Set `currentPricingPlanId = null` for affected users
6. Log results

---

## Testing Scenarios

### ✅ Scenario 1: Valid Subscription with Sessions
```
User: Has active subscription
Plan: { appointmentLimit: 5, durationDays: 30 }
Subscription: { remainingSessions: 3, daysRemaining: 15 }
Result: ✅ Appointment created, remainingSessions = 2
```

### ❌ Scenario 2: Expired Subscription (Duration)
```
User: Has subscription
Plan: { durationDays: 30 }
Subscription: { endDate: "2024-01-01" } (past date)
Result: ❌ "Your subscription has expired. Please renew to book appointments."
```

### ❌ Scenario 3: No Remaining Sessions
```
User: Has active subscription
Plan: { appointmentLimit: 5 }
Subscription: { remainingSessions: 0, daysRemaining: 10 }
Result: ❌ "You have no remaining appointment slots in your subscription."
```

### ✅ Scenario 4: Instant Session (First Time)
```
User: Has active subscription
Plan: { isInstantSession: true }
Subscription: { status: "ACTIVE" }
Result: ✅ Appointment created, subscription status → EXPIRED
```

### ❌ Scenario 5: Instant Session (Second Attempt)
```
User: Previously used instant session
Subscription: { status: "EXPIRED" }
Result: ❌ "No active subscription found. Please subscribe to a plan first."
```

### ❌ Scenario 6: No Subscription
```
User: Never subscribed
Result: ❌ "No active subscription found. Please subscribe to a plan first."
```

---

## Integration Points

### Frontend Integration
```typescript
// 1. Check eligibility before showing booking form
const checkEligibility = async () => {
  const response = await fetch('/appointments/eligibility', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  
  if (!data.eligible) {
    showError(data.reason);
    redirectToSubscriptionPage();
  } else {
    showBookingForm();
    displayRemainingInfo(data.daysRemaining, data.remainingSessions);
  }
};

// 2. Create appointment
const bookAppointment = async (appointmentData) => {
  try {
    const response = await fetch('/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(appointmentData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      showError(error.message);
      return;
    }
    
    const appointment = await response.json();
    redirectToPayment(appointment.checkoutUrl);
  } catch (error) {
    showError('Failed to book appointment');
  }
};
```

---

## Database Schema Impact

### No Schema Changes Required ✅
This implementation uses existing schema fields:
- `UserSubscription.remainingSessions`
- `UserSubscription.endDate`
- `UserSubscription.status`
- `PricingPlan.duration`
- `PricingPlan.appointmentLimit`
- `PricingPlan.isInstantSession`
- `User.currentPricingPlanId`

---

## Error Handling

All validation errors return HTTP 400 (Bad Request) with descriptive messages:

| Error Condition | Message |
|----------------|---------|
| No subscription | "No active subscription found. Please subscribe to a plan first." |
| Inactive subscription | "Your subscription is not active." |
| Inactive plan | "Your subscription plan is no longer active." |
| Expired (duration) | "Your subscription has expired. Please renew to book appointments." |
| No sessions | "You have no remaining appointment slots in your subscription." |

---

## Performance Considerations

1. **Caching**: Consider caching active subscriptions for frequently booking users
2. **Database Indexes**: Existing indexes on `userId` and `planId` in UserSubscription table
3. **Cron Job**: Runs once daily to minimize database load
4. **Validation**: Single database query to fetch subscription with plan (optimized join)

---

## Future Enhancements

1. **Subscription Renewal**: Auto-renew subscriptions when `autoRenew = true`
2. **Grace Period**: Allow booking X days after expiry
3. **Session Top-Up**: Allow users to purchase additional sessions
4. **Notification Preferences**: Let admins configure notification types
5. **Analytics**: Track booking patterns and subscription usage

---

## Deployment Checklist

- [x] Create SubscriptionValidationService
- [x] Update AppointmentService with validation
- [x] Update SubscriptionCronService for auto-expiry
- [x] Add eligibility endpoint to AppointmentController
- [x] Update AppointmentModule providers
- [x] Generate Prisma client
- [ ] Run database migrations (if any)
- [ ] Test all scenarios
- [ ] Update API documentation
- [ ] Deploy to staging
- [ ] Monitor cron job execution
- [ ] Deploy to production

---

## Support & Maintenance

### Monitoring
- Check cron job logs daily for expiry counts
- Monitor appointment creation success rate
- Track validation rejection reasons

### Common Issues
1. **Cron not running**: Check NestJS Schedule module configuration
2. **Validation too strict**: Review business rules with stakeholders
3. **Admin not notified**: Verify admin type and isActive status

---

## Contact
For questions or issues, contact the development team.

**Last Updated**: February 2024
**Version**: 1.0.0
