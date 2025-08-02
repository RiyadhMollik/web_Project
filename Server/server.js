const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// Load environment variables
try {
  require('dotenv').config();
} catch (error) {
  console.log('dotenv not available, using default environment variables');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Import database connection
let testConnection, syncDatabase;
try {
  const models = require('./models');
  testConnection = models.testConnection;
  syncDatabase = models.syncDatabase;
} catch (error) {
  console.error('Failed to load models:', error.message);
  testConnection = async () => { throw new Error('Models not loaded'); };
  syncDatabase = async () => { throw new Error('Models not loaded'); };
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
let authRoutes, userRoutes, appointmentRoutes, reviewRoutes;

try {
  authRoutes = require('./routes/auth.routes');
  userRoutes = require('./routes/user.routes');
  appointmentRoutes = require('./routes/appointment.routes');
  reviewRoutes = require('./routes/review.routes');
} catch (error) {
  console.error('Failed to load routes:', error.message);
  authRoutes = express.Router();
  userRoutes = express.Router();
  appointmentRoutes = express.Router();
  reviewRoutes = express.Router();
}

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CureSync API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    // Test database connection
    await testConnection();
    console.log('✅ Database connection established');

    // Sync database tables
    await syncDatabase();
    console.log('✅ Database tables synced');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('Server will continue without database connection');
  }

  // Seed sample data (optional - for development)
  if (process.env.NODE_ENV === 'development') {
    try {
      const { seedData } = require('./seeders/seedData');
      await seedData();
      console.log('✅ Sample data seeded successfully');
    } catch (error) {
      console.log('Note: Data seeder not available or failed:', error.message);
    }
  }
});

module.exports = app;
