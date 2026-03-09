const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient({});
app.use(cors());
app.use(express.json());

// Routes import
const authRoutes = require('./src/routes/auth');
const salesRoutes = require('./src/routes/sales');

// Routes usage
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Factory ERP Backend is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
