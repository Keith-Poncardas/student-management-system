# Student Management System

A full-stack Student Management System MVP built with modern technologies.

## Tech Stack

### Backend
- Node.js + Express.js + TypeScript
- GraphQL + Apollo Server
- Prisma ORM + PostgreSQL (Neon)
- JWT Authentication + bcrypt

### Frontend
- React.js + TypeScript
- Apollo Client + Zustand
- React Router + Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)

### 1. Clone and Install

```bash
npm run install:all
```

### 2. Configure Database

Update `backend/.env` with your Neon PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/student_management?sslmode=require"
```

### 3. Run Migrations

```bash
cd backend
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client

```bash
cd backend
npx prisma generate
```

### 5. Seed Database

```bash
cd backend
npm run seed
```

### 6. Start Development Servers

From the root directory:
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Default Admin Credentials
- Email: `admin@school.com`
- Password: `admin123`

## URLs
- **Frontend**: http://localhost:5173
- **Backend GraphQL**: http://localhost:4000/graphql

## Features
- JWT Authentication (Login/Signup)
- Student CRUD Management
- Teacher CRUD Management
- Course Management (with Teacher assignment)
- Enrollment Management (Student ↔ Course)
- Grade Management
- Dashboard with Statistics
- Search and Pagination
- Responsive Design
