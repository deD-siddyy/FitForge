const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { connectDB } = require('./config');
const { errorHandler } = require('./middleware');
const { authRoutes, userRoutes, fitnessRoutes, trackingRoutes, dashboardRoutes } = require('./routes');


dotenv.config();

connectDB();

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'FitForge API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});


app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 FitForge API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
