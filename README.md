# Premium Nike-Inspired E-Commerce Web App

This is a full-stack MERN web application with a premium, modern design inspired by Nike.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, React Router v6
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)

## Features Included
- 🎨 Ultra-modern Nike-style UI
- 🌓 Dark/Light Mode toggle
- 🪄 Smooth animations using Framer Motion
- 📱 Fully Responsive
- 👟 Sample Nike Product Data
- 🛍️ Foundation for Wishlist, Cart, Product Detail pages
- 🔌 Express server setup ready for DB integration

## Setup Instructions

### 1. Backend (Server) Setup
Open a terminal and navigate to the `server` directory:
```bash
cd server
npm install
```
Start the backend development server:
```bash
node index.js
```
*(Runs on `http://localhost:5000`)*

### 2. Frontend (Client) Setup
Open another terminal and navigate to the `client` directory:
```bash
cd client
npm install
```
Start the frontend development server:
```bash
npm run dev
```
*(Runs on Vite default port, usually `http://localhost:5173`)*

## Future Integrations
- Connect `server/index.js` to a real MongoDB database by adding your `MONGO_URI` to a `.env` file.
- Add Stripe and Razorpay integrations in the backend routes for payments.
- Expand AI chatbot capabilities in the frontend client.

Enjoy building this premium experience!
