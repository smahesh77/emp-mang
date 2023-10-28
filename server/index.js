const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const employeeRoutes = require('./routes/EmployeeRoute');
const departmentRoutes = require('./routes/DepartmentRoute');

// Ping-Pong Route
app.get('/ping', (req, res) => {
  res.send('pong');
});
app.use('/employees', employeeRoutes);
app.use('/departments', departmentRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
