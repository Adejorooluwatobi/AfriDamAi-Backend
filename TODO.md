# Afridam Backend Updates TODO

## Clinical Intelligence & Onboarding
- [ ] Add Fitzpatrick scale field to Profile (skinToneLevel: Int)
- [ ] Add nationality field to User or Profile
- [ ] Add skip logic handling in onboarding (backend validation for optional fields)

## Revenue & Appointment Logic
- [ ] Add new models: Appointment, Session, PricingPlan
- [ ] Update Consultation to use specialty tiers (Dermatologist/Consultant)
- [ ] Add pricing: Starter Plan $3/month, Instant Session $15
- [ ] Update appointment view logic

## Security & Compliance
- [ ] Add account deletion workflow (soft delete or request)
- [ ] Ensure auth guard redirects logged-in users to /dashboard

## UI/UX Stabilization
- [ ] Add forgot password functionality in auth
- [ ] Update analyzer for viewfinder UI (backend status updates)

## Implementation Steps
- [ ] Update prisma/schema.prisma with new models/fields
- [ ] Create new domain entities
- [ ] Create new controllers and modules
- [ ] Create new services
- [ ] Update DTOs and repositories
- [ ] Run prisma migrate
- [ ] Update app.module.ts if needed
