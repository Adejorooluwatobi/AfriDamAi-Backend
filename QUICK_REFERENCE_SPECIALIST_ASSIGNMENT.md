# Quick Reference - Specialist Assignment System

## 🚀 Quick Start

### For Admins

**1. Assign Specialists to Appointment**
```bash
curl -X POST http://localhost:3000/appointments/APPOINTMENT_ID/assign-specialists \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "specialistIds": ["specialist_1", "specialist_2", "specialist_3"]
  }'
```

---

### For Specialists

**1. View My Assignments**
```bash
curl -X GET http://localhost:3000/appointments/assignments/me \
  -H "Authorization: Bearer SPECIALIST_TOKEN"
```

**2. Accept Assignment**
```bash
curl -X POST http://localhost:3000/appointments/assignments/ASSIGNMENT_ID/accept \
  -H "Authorization: Bearer SPECIALIST_TOKEN"
```

**3. Decline Assignment**
```bash
curl -X POST http://localhost:3000/appointments/assignments/ASSIGNMENT_ID/decline \
  -H "Authorization: Bearer SPECIALIST_TOKEN"
```

**4. Complete Appointment**
```bash
curl -X PUT http://localhost:3000/appointments/APPOINTMENT_ID/complete \
  -H "Authorization: Bearer SPECIALIST_TOKEN"
```

---

### For Users

**1. Complete Appointment**
```bash
curl -X PUT http://localhost:3000/appointments/APPOINTMENT_ID/complete \
  -H "Authorization: Bearer USER_TOKEN"
```

---

## 📊 Database Queries

### Check Specialist Stats
```sql
SELECT 
  firstName,
  lastName,
  completedAppointments,
  status,
  isActive
FROM "Specialist"
WHERE id = 'specialist_id';
```

### View Assignment History
```sql
SELECT 
  sa.id,
  sa.status,
  sa.assignedAt,
  sa.respondedAt,
  s.firstName || ' ' || s.lastName as specialist_name,
  a.specialty
FROM "SpecialistAssignment" sa
JOIN "Specialist" s ON sa.specialistId = s.id
JOIN "Appointment" a ON sa.appointmentId = a.id
WHERE sa.appointmentId = 'appointment_id'
ORDER BY sa.assignedAt;
```

### Get Pending Assignments
```sql
SELECT 
  sa.*,
  a.specialty,
  a.scheduledAt,
  u.firstName || ' ' || u.lastName as patient_name
FROM "SpecialistAssignment" sa
JOIN "Appointment" a ON sa.appointmentId = a.id
JOIN "User" u ON a.userId = u.id
WHERE sa.specialistId = 'specialist_id'
  AND sa.status = 'PENDING'
ORDER BY sa.assignedAt DESC;
```

---

## 🔔 Notification Types

| Type | Recipient | Trigger |
|------|-----------|---------|
| `specialistAssignment` | Specialist | Admin assigns specialist |
| `specialistAssignmentProgress` | User | Specialists being assigned |
| `specialistAccepted` | User | Specialist accepts |
| `appointmentFilled` | Other Specialists | Another specialist accepts |
| `appointmentCompleted` | User & Specialist | Appointment marked complete |

---

## 🎯 Status Flow

### SpecialistAssignment Status
```
PENDING → ACCEPTED (first to accept)
       → DECLINED (specialist declines)
       → CANCELLED (another specialist accepted)
```

### Appointment Status
```
PENDING → CONFIRMED (specialist accepts)
        → COMPLETED (user or specialist completes)
```

---

## ⚡ Quick Tips

1. **Multiple Specialists**: Assign 2-3 specialists for faster acceptance
2. **First Come First Served**: First specialist to accept gets the appointment
3. **Auto-Cancel**: Other assignments automatically cancelled when one accepts
4. **Tracking**: Completed appointments auto-tracked per specialist
5. **Both Can Complete**: Either user or specialist can mark as complete

---

## 🐛 Common Issues

### Issue: "Assignment has already been responded to"
**Solution**: Another specialist already accepted. Check appointment status.

### Issue: "Can only assign specialists to pending appointments"
**Solution**: Appointment already confirmed or completed.

### Issue: "Specialist not available"
**Solution**: Specialist status must be APPROVED and isActive = true.

### Issue: "Access denied: Admin role required"
**Solution**: Only OPERATIONS_ADMIN or SUPER_ADMIN can assign specialists.

---

## 📱 Frontend Integration Example

```typescript
// Admin assigns specialists
const assignSpecialists = async (appointmentId: string, specialistIds: string[]) => {
  const response = await fetch(`/appointments/${appointmentId}/assign-specialists`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ specialistIds })
  });
  return response.json();
};

// Specialist accepts assignment
const acceptAssignment = async (assignmentId: string) => {
  const response = await fetch(`/appointments/assignments/${assignmentId}/accept`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${specialistToken}`
    }
  });
  return response.json();
};

// Get specialist's assignments
const getMyAssignments = async () => {
  const response = await fetch('/appointments/assignments/me', {
    headers: {
      'Authorization': `Bearer ${specialistToken}`
    }
  });
  return response.json();
};

// Complete appointment
const completeAppointment = async (appointmentId: string) => {
  const response = await fetch(`/appointments/${appointmentId}/complete`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

---

## 🎨 UI Recommendations

### Admin Dashboard
- Show pending appointments needing specialist assignment
- List of available specialists with their completed count
- Multi-select for assigning specialists

### Specialist Dashboard
- Show pending assignments with patient details
- Accept/Decline buttons
- Show completed appointments count
- Filter by status (PENDING, ACCEPTED, DECLINED)

### User Dashboard
- Show appointment status
- Display assigned specialist details when confirmed
- Complete appointment button when done

---

## 📈 Metrics to Track

1. **Average Time to Accept**: Time from assignment to acceptance
2. **Acceptance Rate**: % of assignments accepted vs declined
3. **Specialist Performance**: Completed appointments per specialist
4. **User Satisfaction**: Ratings after completion (future feature)

---

## ✅ Testing Checklist

- [ ] Admin can assign multiple specialists
- [ ] Specialists receive notifications
- [ ] User receives progress notification
- [ ] First specialist can accept
- [ ] Appointment status changes to CONFIRMED
- [ ] Other assignments cancelled
- [ ] User notified with specialist details
- [ ] Other specialists notified
- [ ] Specialist can complete appointment
- [ ] User can complete appointment
- [ ] Completed count increments
- [ ] Both parties receive completion notification

---

**For detailed documentation, see `SPECIALIST_ASSIGNMENT_IMPLEMENTATION.md`**

**Happy coding! 🚀**
