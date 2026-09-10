# FitForge

A full-stack MERN application for adaptive fitness management.

## Project Structure

```
fitforge/
├── backend/            # Node.js + Express API
│   ├── config/         # Database & app configuration
│   ├── controllers/    # Route handler logic
│   ├── middleware/      # Auth, error handling middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express route definitions
│   ├── utils/          # Shared utilities & helpers
│   ├── server.js       # App entry point
│   └── package.json
│
└── frontend/           # React + Vite SPA
    ├── src/
    │   ├── assets/     # Static assets (images, fonts)
    │   ├── components/ # Reusable UI components
    │   ├── context/    # React Context providers
    │   ├── hooks/      # Custom React hooks
    │   ├── pages/      # Page-level components
    │   └── services/   # API service layer (Axios)
    ├── vite.config.js
    └── package.json
```

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or a MongoDB Atlas connection string
- **npm** v9+

### Backend

```bash
cd backend
npm install
npm run dev      # Starts with nodemon (hot-reload)
# or
npm start        # Production mode
```

The API runs at `http://localhost:5000` by default.

### Frontend

```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server
```

The app runs at `http://localhost:5173` by default.

### Environment Variables

Copy the `.env.example` files in both `backend/` and `frontend/` and rename to `.env`, then fill in your values.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 19, Vite, React Router, Axios |
| Backend    | Node.js, Express                  |
| Database   | MongoDB, Mongoose                 |
| Auth       | JWT, bcryptjs                     |

## License

ISC
