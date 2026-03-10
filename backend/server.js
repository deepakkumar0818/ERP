const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Routes import (Hum abhi banayenge)
const authRoutes = require('./src/routes/auth');
const salesRoutes = require('./src/routes/sales');
// Routes usage
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);

app.get('/', (req, res) => {
  res.send('Factory ERP Backend is Running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
