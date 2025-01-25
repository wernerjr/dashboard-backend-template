# Business Rules Documentation

## 👤 User Management

### User Roles
- **USER**: Regular user with basic permissions
- **ADMIN**: Administrator with full system access

### Password Requirements
1. **Length**:
   - Minimum: 8 characters
   - Maximum: 30 characters

2. **Complexity**:
   - At least one uppercase letter (A-Z)
   - At least one lowercase letter (a-z)
   - At least one number (0-9)
   - At least one special character (@$!%*?&)

3. **Password Change Rules**:
   - New password must be different from current password
   - Current password must be verified before change
   - Password is hashed using bcrypt (10 rounds) before storage

### Email Rules
1. **Format**: Must be a valid email format
2. **Uniqueness**: Email must be unique in the system
3. **Updates**: Users can change their email if the new one is not already in use

### Name Requirements
- Minimum length: 2 characters
- Optional in profile updates

## 🔐 Authentication & Authorization

### Registration
1. **Public Access**: Anyone can register
2. **Default Role**: New users get 'USER' role by default
3. **Required Fields**:
   - Name
   - Email (unique)
   - Password (following password rules)
4. **Optional Fields**:
   - Role (only ADMIN can set this)

### Login
1. **Required Fields**:
   - Email
   - Password
2. **Response**:
   - JWT token (valid for 24 hours)
   - User information (excluding password)

### Session Management
1. **Token Validity**: 24 hours
2. **Token Content**:
   - User ID
   - User Role
   - Issue and expiration timestamps

## 👮 Access Control

### Public Routes (No Authentication Required)
- POST /api/users/register
- POST /api/users/login

### Authenticated Routes (Valid Token Required)
- GET /api/users/profile
- PUT /api/users/profile
- PUT /api/users/change-password

### Admin-Only Routes
- GET /api/users (list all users)
- DELETE /api/users/:id (when deleting other users)

## 🗑️ Account Deletion Rules

### Self-Deletion
1. Users can delete their own accounts
2. No additional permission required
3. Immediate and permanent deletion

### Admin Deletion
1. Admins can delete any user account
2. Cannot delete the last admin account in the system
3. No confirmation required

## 📝 Profile Management

### Updatable Fields
1. **Name**:
   - Optional update
   - Minimum 2 characters

2. **Email**:
   - Optional update
   - Must be unique
   - Must be valid format

### Password Change
1. **Requirements**:
   - Current password verification
   - New password following password rules
   - New password must be different from current

2. **Process**:
   - Verify current password
   - Validate new password
   - Hash and update

## 🛡️ Security Rules

### Rate Limiting
- Login attempts limited
- Password change attempts limited

### Account Protection
1. **Password Storage**:
   - Always hashed (never plain text)
   - Using bcrypt with 10 rounds

2. **Sensitive Data**:
   - Passwords never returned in responses
   - Email only visible to owner and admins

### Admin Protection
1. **Last Admin**:
   - System must always have at least one admin
   - Last admin account cannot be deleted
   - Last admin cannot be demoted to regular user

## 🔄 Response Format Standards

### Success Responses
```json
{
  "success": true,
  "data": {
    // Response specific data
  }
}
```

### Error Responses
```json
{
  "success": false,
  "error": {
    "code": number,
    "type": string,
    "message": string,
    "details": array (optional)
  }
}
```

## ⚠️ Error Handling

### HTTP Status Codes
- 200: Success
- 201: Created (new user registration)
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

### Validation Errors
1. **Input Validation**:
   - All inputs validated before processing
   - Detailed error messages returned
   - Field-specific error identification

2. **Business Rule Validation**:
   - Unique email enforcement
   - Password complexity rules
   - Role-based access control 