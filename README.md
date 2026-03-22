# 🍔 Vingo - Food Delivery App

A full-stack food delivery web application built with the MERN stack, inspired by Zomato/Swiggy.

## 🚀 Live Demo
- Frontend: [coming soon]
- Backend API: [coming soon]

## ✨ Features

### 👤 Customer
- Browse restaurants and food items by category
- Search food items across the city
- Add to cart & place orders
- Real-time order tracking with live map
- Online payment via Razorpay
- Rate delivered food items

### 🏪 Restaurant Owner
- Create and manage restaurant profile
- Add, edit, delete menu items
- Manage incoming orders in real-time
- Assign delivery partners

### 🛵 Delivery Partner
- Accept delivery assignments
- Real-time location sharing
- OTP-based delivery confirmation
- Daily earnings dashboard

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Redux Toolkit, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT + Google OAuth (Firebase) |
| Payment | Razorpay |
| Maps | Leaflet.js + Geoapify |
| Real-time | Socket.io |
| Image Upload | Cloudinary |

## 📁 Project Structure
```
vingo-food-delivery/
├── frontened/          # React frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── redux/      # State management
│   │   └── assets/     # Images
└── backened/           # Node.js backend
    ├── routes/         # API routes
    ├── utils/          # Utilities
    └── index.js        # Entry point
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Frontend
```bash
cd frontened
npm install
npm run dev
```

### Backend
```bash
cd backened
npm install
npm run dev
```

### Environment Variables

**Backend `.env`:**
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

**Frontend `.env`:**
```
VITE_SERVER_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_key
VITE_GEOAPIKEY=your_geoapify_key
```

## 👩‍💻 Developer
Made with ❤️ by **Astha** 

[![GitHub](https://img.shields.io/badge/GitHub-theasthabang-black?logo=github)](https://github.com/theasthabang)
