const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const employeeRoutes = require('./routes/EmployeeRoute');
const departmentRoutes = require('./routes/DepartmentRoute');

app.use('/employees', employeeRoutes);
app.use('/departments', departmentRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
