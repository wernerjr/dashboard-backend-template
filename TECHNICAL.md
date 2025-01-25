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
- **Validation**: Zod

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

### Password Validation
```typescript
const passwordValidator = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(30, 'Password must not exceed 30 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );
```

## 🛣️ API Routes Detail

### Authentication Routes
```typescript
POST /api/auth/register
Body: {
  name: string;      // min 2 chars
  email: string;     // valid email format
  password: string;  // following password rules
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
      updatedAt: string;
    };
    token: string;
  }
}
```

```typescript
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
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  }
}
```

### User Routes
```typescript
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
      createdAt: string;
      updatedAt: string;
    }
  }
}
```

```typescript
PUT /api/users/profile
Headers: {
  Authorization: 'Bearer <token>'
}
Body: {
  name?: string;  // min 2 chars
  email?: string; // valid email format
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
      updatedAt: string;
    }
  }
}
```

```typescript
PUT /api/users/change-password
Headers: {
  Authorization: 'Bearer <token>'
}
Body: {
  currentPassword: string;
  newPassword: string;  // following password rules
}
Response: {
  success: true;
  data: {
    message: string;
  }
}
```

## 🛡️ Error Handling

### Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: number;
    type: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}
```

## 🔧 Middleware Stack

1. **CORS**: Cross-Origin Resource Sharing
   ```typescript
   cors({
     origin: process.env.FRONTEND_URL || '*',
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
     credentials: true,
     allowedHeaders: ['Content-Type', 'Authorization']
   })
   ```

2. **Request Validation**:
   ```typescript
   const validateRequest = (schema: AnyZodObject) => {
     return async (req: Request, res: Response, next: NextFunction) => {
       try {
         const validatedData = await schema.parseAsync(req.body);
         req.body = validatedData;
         return next();
       } catch (error) {
         // Error handling
       }
     };
   };
   ```

3. **Authentication**:
   ```typescript
   const authenticate = (req: Request, res: Response, next: NextFunction): void => {
     // JWT verification and user attachment
   };
   ```

## 🛠️ Development Tools

### CLI Tools
1. **Role Management**:
   ```bash
   npm run user:change-role
   ```
   Interactive CLI for managing user roles with validation and confirmation.

### Database Management
- **Prisma Studio**: GUI for database management
- **Migrations**: Version-controlled schema changes
- **Seeding**: Initial data population

## 📊 Response Standards

### Success Format
```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
}
```

### Error Format
```typescript
interface ValidationError {
  field: string;
  message: string;
}

interface ErrorDetails {
  code: number;
  type: string;
  message: string;
  details?: ValidationError[];
}
```

## 🔒 Security Implementation

### Password Hashing
```typescript
const hashedPassword = await bcrypt.hash(password, 10);
```

### JWT Generation
```typescript
const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: '1d' }
);
```

## 🚀 Performance Considerations

1. **Database**:
   - Indexed fields: email, role
   - Selective field queries
   - Proper relationship management

2. **API**:
   - Response compression
   - Proper error handling
   - Async operations
   - Input validation
   - Type safety

## 📈 Monitoring

### Error Logging
```typescript
if (process.env.NODE_ENV === 'development') {
  console.error(error);
  // Include stack trace
}
```

### Response Times
- Database query monitoring
- Request-response cycle timing
- Error rate tracking 