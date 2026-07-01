# 🍽 Slooze — Nick Fury's Food Ordering App

A full-stack role-based food ordering application built for Nick Fury's team. The application demonstrates enterprise-level authentication, authorization, and country-based access control using modern web technologies.

---

## ✨ Features

- 🔐 JWT Authentication
- 👥 Role-Based Access Control (RBAC)
- 🌍 Relationship-Based Access Control (ReBAC) based on country
- 🍽 Browse Restaurants & Menus
- 🛒 Create Orders
- 💳 Checkout & Payment
- ❌ Cancel Orders
- 💳 Manage Payment Methods (Admin only)
- 🚀 GraphQL API
- 📱 Responsive User Interface

---

## 👥 Demo Accounts

| Character | Email | Role | Country |
|-----------|-------|------|---------|
| 👑 Nick Fury | nick.fury@shield.com | Admin | 🇮🇳 India |
| 🦸 Captain Marvel | captain.marvel@shield.com | Manager | 🇮🇳 India |
| 🛡 Captain America | captain.america@shield.com | Manager | 🇺🇸 America |
| 💜 Thanos | thanos@shield.com | Member | 🇮🇳 India |
| ⚡ Thor | thor@shield.com | Member | 🇮🇳 India |
| 🤠 Travis | travis@shield.com | Member | 🇺🇸 America |

**Password for all accounts:** `password123`

---

## 🔐 Role Permissions

| Feature | Admin | Manager | Member |
|---------|:-----:|:-------:|:------:|
| View Restaurants & Menus | ✅ | ✅ | ✅ |
| Create Order | ✅ | ✅ | ✅ |
| Checkout & Payment | ✅ | ✅ | ❌ |
| Cancel Order | ✅ | ✅ | ❌ |
| Update Payment Method | ✅ | ❌ | ❌ |

---

## 🌍 Country-Based Access (ReBAC)

### 🇮🇳 India
Users:
- Captain Marvel
- Thanos
- Thor

Restaurants:
- Spice Garden
- Biryani House
- Dosa Dhaba

### 🇺🇸 America
Users:
- Captain America
- Travis

Restaurants:
- Burger Bliss
- Pizza Palace
- Texas BBQ Co.

### 👑 Admin

Nick Fury has unrestricted access to all restaurants and application features.

---

## 🏗 Tech Stack

### Backend
- NestJS
- GraphQL (Code-First)
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- TypeScript

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Apollo Client

---

## 🔧 Environment Variables

Create a `.env` file inside the `backend` folder.

```env
DATABASE_URL="your_neon_postgresql_connection_string"

JWT_SECRET="your-secret-key"
```

---

## 🚀 Running Locally

### Prerequisites

```bash
node --version   # 18+
npm --version    # 9+
```

### 1. Backend

```bash
cd backend

npm install

npx prisma generate

npx prisma migrate dev

npx ts-node prisma/seed.ts

npm run start:dev
```

GraphQL Endpoint:

```
http://localhost:4000/graphql
```

### 2. Frontend

Open a new terminal.

```bash
cd frontend

npm install

npm run dev
```

Application:

```
http://localhost:3000
```

---

## 🗃 Mock Data

### 🇮🇳 India

Restaurants:
- Spice Garden
- Biryani House
- Dosa Dhaba

Users:
- Nick Fury
- Captain Marvel
- Thanos
- Thor

### 🇺🇸 America

Restaurants:
- Burger Bliss
- Pizza Palace
- Texas BBQ Co.

Users:
- Captain America
- Travis

---

## 📁 Project Structure

```text
Slooze/
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## 🚧 Deployment

Deployment instructions will be added after hosting the application.

Recommended Hosting:

- Frontend: Railway
- Backend: Railway
- Database: Neon PostgreSQL

---

## 📌 Concepts Demonstrated

- JWT Authentication
- Role-Based Access Control (RBAC)
- Relationship-Based Access Control (ReBAC)
- GraphQL API Development
- Prisma ORM
- PostgreSQL Database Design
- Full-Stack Development
- Responsive UI Design
- TypeScript
