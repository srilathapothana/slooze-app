# 🍽 Slooze — Nick Fury's Food Ordering App

A full-stack role-based food ordering application built for Nick Fury's team.

## 👥 The Team

| Character | Email | Role | Country |
|-----------|-------|------|---------|
| 👑 Nick Fury | nick.fury@shield.com | Admin | 🇮🇳 India |
| 🦸 Captain Marvel | captain.marvel@shield.com | Manager | 🇮🇳 India |
| 🛡 Captain America | captain.america@shield.com | Manager | 🇺🇸 America |
| 💜 Thanos | thanos@shield.com | Member | 🇮🇳 India |
| ⚡ Thor | thor@shield.com | Member | 🇮🇳 India |
| 🤠 Travis | travis@shield.com | Member | 🇺🇸 America |

**Password for all accounts: `password123`**

## 🔐 Role Permissions

| Feature | Admin (Nick Fury) | Manager | Member |
|---------|:-----------------:|:-------:|:------:|
| View restaurants & menu | ✅ | ✅ | ✅ |
| Create order | ✅ | ✅ | ✅ |
| Checkout & pay | ✅ | ✅ | ❌ |
| Cancel order | ✅ | ✅ | ❌ |
| Update payment method | ✅ | ❌ | ❌ |

## 🌍 Re-BAC (Country Scoping)

- Captain Marvel & Indian members (Thanos, Thor) → see only 🇮🇳 Indian restaurants
- Captain America & Travis → see only 🇺🇸 American restaurants
- Nick Fury (Admin) → sees everything

## 🚀 Running Locally

### Prerequisites
```bash
node --version  # 18+
npm --version   # 9+
```

### Step 1 — Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
npm run start:dev
# → http://localhost:4000/graphql
```

### Step 2 — Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

## 🏗 Tech Stack
- **Backend:** NestJS · GraphQL (Code-First) · Prisma ORM · SQLite · JWT Auth
- **Frontend:** Next.js 14 · TypeScript · Tailwind CSS · Apollo Client

## 🗃 Mock Data
**India 🇮🇳:** Spice Garden, Biryani House, Dosa Dhaba
**America 🇺🇸:** Burger Bliss, Pizza Palace, Texas BBQ Co.
