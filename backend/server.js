const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Routes import
const authRoutes = require('./src/routes/auth');
const salesRoutes = require('./src/routes/sales');
const productionRoutes = require('./src/routes/production');
const inventoryRoutes = require('./src/routes/inventory');
const jobOrderRoutes = require('./src/routes/jobOrder');

// Routes usage
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/job-orders', jobOrderRoutes);

app.get('/', (req, res) => {
  res.send('Factory ERP Backend is Running!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});