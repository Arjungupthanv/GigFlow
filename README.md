# GigFlow

A freelance marketplace where clients post gigs and freelancers bid on them.

## Live Demo

**Frontend:** https://storied-souffle-1d3a92.netlify.app  
**Backend API:** https://gigflow-production.up.railway.app

## Features

- User authentication with JWT
- Post and browse gigs
- Submit bids with proposals
- Hire freelancers
- Search functionality
- Real-time updates

## Tech Stack

**Frontend:** React, Redux Toolkit, Tailwind CSS, Vite  
**Backend:** Node.js, Express, MongoDB, Socket.io

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
```

Run the server:
```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

## API Endpoints

**Auth:**
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Get current user

**Gigs:**
- GET `/api/gigs` - Get all gigs
- GET `/api/gigs/:id` - Get single gig
- POST `/api/gigs` - Create gig

**Bids:**
- POST `/api/bids` - Submit bid
- GET `/api/bids/:gigId` - Get bids for gig
- PATCH `/api/bids/:bidId/hire` - Hire freelancer

## Deployment

Backend can be deployed on Railway or Render. Frontend works with Netlify or Vercel.

## Testing

1. Register two accounts
2. Create a gig with one account
3. Bid on it with the other
4. Accept the bid

## Author

Arjun  
arjungupthanv@gmail.com

