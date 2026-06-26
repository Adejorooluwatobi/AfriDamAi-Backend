# Afridam Backend API - Feature Implementation Guide

## Overview
This document outlines the implementation of key features as specified in the requirements document.

## 🚀 Key Features Implemented

### 1. Clinical Intelligence & Onboarding

#### Fitzpatrick Scale Integration
- **Endpoint**: `POST /profile`
- **Field**: `skinToneLevel` (1-6 scale)
- **Purpose**: Provides AI with better baseline data for African skin pathologies

#### Nationality & Allergy Fields
- **User Registration**: `POST /auth/user/register`
  - Added `nationality` field for medical logic
- **Profile Creation**: `POST /profile`
  - Added `knownSkinAllergies` array for AI filtering

#### Skip Onboarding Logic
- **Endpoint**: `POST /profile/skip-onboarding`
- **Purpose**: Prevents user drop-off during onboarding
- **Field**: `onboardingSkipped` boolean flag

### 2. Revenue & Appointment Logic

#### Choice-Based Access Pricing
- **Instant Specialist Session**: $15 (one-time)
- **Starter Care Plan**: $3 (first month)

#### Endpoints
```bash
# Create appointment with pricing
POST /appointments
{
  "specialty": "DERMATOLOGIST" | "CONSULTANT",
  "type": "INSTANT_SESSION" | "STARTER_PLAN"
}

# Get pricing information
GET /appointments/pricing
```

#### Specialty-Based Tiers
- Removed individual doctor names
- Implemented load-balancing ready structure
- Backend handles specialist assignment

### 3. Security & Compliance

#### Account Dignity Zone
- **Endpoint**: `DELETE /auth/account`
- **Purpose**: GDPR/NDPR compliance
- **Action**: Soft delete with `deletedAt` timestamp

#### Smart Guard Redirect
- **Guard**: `SmartRedirectGuard`
- **Purpose**: Prevents authenticated users from accessing landing page
- **Action**: Auto-redirects to `/dashboard`

#### Password Recovery
```bash
# Request password reset
POST /auth/forgot-password
{
  "email": "user@example.com"
}

# Reset password with token
POST /auth/reset-password
{
  "token": "reset_token_here",
  "newPassword": "new_secure_password"
}
```

### 4. AI Scanner Enhancements

#### Scanning Status Tracking
- **States**: `initializing`, `capturing`, `processing`, `completed`, `failed`
- **Progress**: 0-100% completion tracking
- **Viewfinder**: Clinical overlay support

#### Endpoints
```bash
# Start scanning session
POST /analyzer/start-scan

# Update scanning status
PUT /analyzer/{id}/status
{
  "status": "processing",
  "progress": 75
}

# Complete scanning
PUT /analyzer/{id}/complete
{
  "imageUrl": "path/to/image",
  "predictions": {"condition": 0.85},
  "description": "Analysis results"
}
```

## 🔧 Technical Implementation

### Database Schema Updates
- Added `nationality` to User model
- Added `skinToneLevel` and `onboardingSkipped` to Profile model
- Added `resetToken`, `resetTokenExpiry`, `deletedAt` to User model

### Security Enhancements
- Fixed token comparison logic in password reset
- Removed plain text token logging
- Added input validation for security-critical methods
- Implemented proper error handling

### Type Safety
- Updated all TypeScript interfaces
- Fixed Prisma enum imports
- Corrected analyzer predictions type (Record<string, number>)

## 📋 API Endpoints Summary

### Authentication
- `POST /auth/user/register` - Register with nationality
- `POST /auth/user/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `DELETE /auth/account` - Delete account (Dignity Zone)

### Profile & Onboarding
- `POST /profile` - Create profile with Fitzpatrick scale
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `POST /profile/skip-onboarding` - Skip onboarding survey

### Appointments
- `POST /appointments` - Create appointment with pricing
- `GET /appointments` - Get user appointments
- `GET /appointments/pricing` - Get pricing information
- `PUT /appointments/{id}/schedule` - Schedule appointment
- `PUT /appointments/{id}/status` - Update appointment status

### AI Scanner
- `POST /analyzer/scan` - Scan and analyze image
- `POST /analyzer/start-scan` - Start scanning session
- `PUT /analyzer/{id}/status` - Update scanning status
- `PUT /analyzer/{id}/complete` - Complete scanning

### System
- `GET /` - Landing page with smart redirect
- `GET /health` - Health check
- `GET /features` - Available features list

## 🛡️ Security Features

1. **Smart Redirect Guard**: Prevents authenticated users from accessing landing page
2. **Input Validation**: Comprehensive validation for all user inputs
3. **Token Security**: Secure password reset token handling
4. **Soft Delete**: Account deletion with data retention for compliance
5. **Error Handling**: Proper error responses without information leakage

## 🎯 Pricing Structure

| Service Type | Price | Duration | Description |
|--------------|-------|----------|-------------|
| Instant Session | $15 | One-time | Immediate specialist consultation |
| Starter Plan | $3 | 30 days | Comprehensive first-month care plan |

## 🔄 Migration Notes

1. Run `npx prisma generate` to update Prisma client
2. Apply database migrations for new fields
3. Update frontend to use new API endpoints
4. Implement smart redirect logic in frontend routing
5. Update UI components for Fitzpatrick scale selector

## 📝 Next Steps

1. Implement email service for password reset tokens
2. Add real-time notifications for appointment updates
3. Integrate payment processing for appointment booking
4. Implement doctor availability and scheduling system
5. Add comprehensive logging and monitoring

---

*This implementation provides a solid foundation for the Afridam platform with all specified features properly integrated and secured.*