# Team Management API

A robust REST API for team management built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Features

- **User Management**: Complete authentication and authorization system
- **Role-Based Access Control**: Support for different user roles (Admin, User)
- **RESTful API**: Well-structured endpoints following REST principles
- **API Documentation**: Interactive Swagger documentation
- **Database Integration**: PostgreSQL with Prisma ORM
- **Security**: JWT authentication, password hashing, and CORS protection
- **TypeScript**: Full type safety and better developer experience

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js >= 14.x
- PostgreSQL >= 13
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/team-management-backend.git
cd team-management-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your configuration.

4. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

## 🚀 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📚 API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3001/api-docs
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run user:change-role` - Interactive CLI to change user roles

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - List all users (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3001 |
| NODE_ENV | Environment | development |
| DATABASE_URL | PostgreSQL connection URL | - |
| JWT_SECRET | JWT secret key | - |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js
- Prisma
- TypeScript
- Node.js community 

## ✨ Author

Made with ❤️ by [Werner](https://github.com/wernerjr)