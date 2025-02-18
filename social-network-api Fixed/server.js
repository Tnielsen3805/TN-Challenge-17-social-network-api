const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import route files for users and thoughts
const userRoutes = require('./routes/api/userRoutes'); // Correct path
const thoughtRoutes = require('./routes/api/thoughtRoutes'); // Correct path

// Middleware to handle routes
app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
