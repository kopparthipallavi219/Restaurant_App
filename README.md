# 👑 Mehfil Restaurant - Iconic Hyderabadi Culinary Institution

A full-stack, enterprise-grade restaurant web application crafted for **Mehfil Restaurant & Bar** (Hyderabad, Telangana). Experience royal Nizami culinary traditions with online food ordering, table reservations, catering quotes, outlet locator, user portal, and executive admin dashboard.

---

## 🌟 Key Features

- **Royal Nizami Theme & UI**: Tailored with custom royal burgundy, saffron, and gold styling.
- **Interactive Menu & Cart**: Filter by categories (Biryani, Kebabs, Desserts), customizable portions, live price calculations, coupon codes, and delivery tracking.
- **Table Reservation System**: Instant seat booking with guest count, dining area preferences, and date/time selection.
- **Event & Party Catering**: Bulk catering request forms for weddings, corporate events, and parties.
- **User Portal**: Manage saved addresses, order history, and personal dining preferences.
- **Executive Admin Dashboard**: Real-time sales metrics, order fulfillment, menu item management, and reservation tracking.
- **Feedback Pop-up**: Interactive 5-star rating, review comments, and feedback submission modal accessible site-wide.
- **SEO & Social Share Ready**: Complete OpenGraph metadata and Google Rich Results Schema (`JsonLdSchema`).

---

## 🏗️ Architecture & Tech Stack

- **Frontend (`/client`)**:
  - Next.js 14 (App Router)
  - React 18 & TypeScript
  - Tailwind CSS & Framer Motion
  - Lucide React Icons
- **Backend API (`/server`)**:
  - Node.js & Express REST API
  - TypeScript & ts-node-dev
  - Mongoose / MongoDB
  - JWT Authentication & Bcrypt
  - Helmet & Rate-Limiter
- **Deployment**:
  - Vercel-ready monorepo configuration (`vercel.json`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### 2. Installation
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Variables

Create `.env` inside `server/` (see `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/mehfil_restaurant
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
```

Create `.env.local` inside `client/` (see `client/.env.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME="Mehfil Restaurant - Authentic Hyderabadi Biryani"
```

### 4. Running the Application

In two separate terminals:

```bash
# Terminal 1: Frontend (Next.js)
cd client
npm run dev

# Terminal 2: Backend (Express API)
cd server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment to Vercel

This repository includes a preconfigured `vercel.json` for one-click deployment:
1. Connect this GitHub repository (`Restaurant_App`) to your **Vercel** account.
2. Add your environment variables (`MONGODB_URI`, `JWT_SECRET`, etc.) in the Vercel project settings.
3. Click **Deploy**.

