# Technical Documentation

## 📐 Architecture

### System Overview
The Team Management API is built on a modern, scalable architecture following clean code principles and industry best practices.

```
src/
├── controllers/    # Business logic
├── middlewares/    # Request processing middleware
├── routes/         # API route definitions
├── schemas/        # Data validation schemas
├── scripts/        # CLI tools and utilities
└── server.ts       # Application entry point
```

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Documentation**: Swagger/OpenAPI
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **API Security**: CORS, Helmet

## 💾 Database Schema

### User
```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

## 🔐 Authentication & Authorization

### JWT Structure
```typescript
interface JWTPayload {
  id: string;
  role: 'USER' | 'ADMIN';
  iat: number;
  exp: number;
}
```

### Authentication Flow
1. User submits credentials
2. Server validates credentials
3. Server generates JWT token
4. Client stores token
5. Token included in subsequent requests

### Authorization Levels
- **Public**: No authentication required
- **Authenticated**: Valid JWT required
- **Admin Only**: Valid JWT with ADMIN role required

## 🛣️ API Routes Detail

### Authentication Routes
\`\`\`typescript
POST /api/auth/register
Body: {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}
Response: {
  success: true;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
    };
    token: string;
  }
}
\`\`\`

\`\`\`typescript
POST /api/auth/login
Body: {
  email: string;
  password: string;
}
Response: {
  success: true;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  }
}
\`\`\`

### User Routes
\`\`\`typescript
GET /api/users/profile
Headers: {
  Authorization: 'Bearer <token>'
}
Response: {
  success: true;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    }
  }
}
\`\`\`

\`\`\`typescript
PUT /api/users/profile
Headers: {
  Authorization: 'Bearer <token>'
}
Body: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}
Response: {
  success: true;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    }
  }
}
\`\`\`

## 🛡️ Error Handling

### Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: number;
    type: string;
    message: string;
    details?: unknown;
  };
}
```

### Common Error Types
- **ValidationError**: Invalid input data
- **AuthenticationError**: Invalid credentials
- **AuthorizationError**: Insufficient permissions
- **NotFoundError**: Resource not found
- **ConflictError**: Resource conflict (e.g., duplicate email)

## 🔧 Middleware Stack

1. **CORS**: Cross-Origin Resource Sharing
2. **Express JSON**: JSON body parser
3. **Express URLEncoded**: Form data parser
4. **Authentication**: JWT verification
5. **Error Handler**: Centralized error processing

## 🛠️ Development Tools

### CLI Commands
- **Role Management**:
  ```bash
  npm run user:change-role
  ```
  Interactive CLI tool for managing user roles.

### Database Management
- **Prisma Studio**:
  ```bash
  npm run prisma:studio
  ```
  GUI for database management.

### API Documentation
- **Swagger UI**:
  ```
  http://localhost:3001/api-docs
  ```
  Interactive API documentation and testing.

## 📊 Response Formats

### Success Response
```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
}
```

### Pagination Response
```typescript
interface PaginatedResponse<T> {
  success: true;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
  };
}
```

## 🔍 Validation

### User Schema
```typescript
const userSchema = {
  name: string()
    .min(2)
    .max(100),
  email: string()
    .email()
    .max(255),
  password: string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
  role: enum(['USER', 'ADMIN'])
    .default('USER')
};
```

## 🔒 Security Measures

1. **Password Security**
   - Bcrypt hashing with salt rounds = 10
   - Password strength validation
   - Secure password reset flow

2. **JWT Security**
   - Short expiration time (1 day)
   - Secure secret key requirement
   - Token invalidation on logout

3. **API Security**
   - Rate limiting
   - CORS protection
   - Input validation
   - SQL injection protection (via Prisma)
   - XSS protection

## 🚀 Performance Optimizations

1. **Database**
   - Indexed fields: email, role
   - Selective field queries
   - Connection pooling

2. **API**
   - Response compression
   - Proper error handling
   - Async/await patterns
   - Proper TypeScript types

## 📈 Monitoring and Logging

### Error Logging
- Error type
- Stack trace (development only)
- Request information
- Timestamp

### Performance Monitoring
- Response times
- Database query times
- Error rates
- API usage statistics 