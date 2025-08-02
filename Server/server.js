const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import database connection
const { testConnection, syncDatabase } = require('./models');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const appointmentRoutes = require('./routes/appointment.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

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

  // Test database connection
  await testConnection();

  // Sync database tables
  await syncDatabase();

  // Seed doctor schedules (optional - for development)
  if (process.env.NODE_ENV === 'development') {
    try {
      const { seedDoctorSchedules } = require('./seeders/doctorSchedules');
      await seedDoctorSchedules();
    } catch (error) {
      console.log('Note: Doctor schedules seeder not available');
    }
  }
});

module.exports = app;
