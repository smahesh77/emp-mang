const mongoose = require('mongoose');
const db = require('../config/db')
const employeeSchema = new db.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  contactNumber: {
    type: String,
  },
  dateOfJoining: {
    type: Date,
  },
  yearsOfExperience: {
    type: Number,
  },
});

const Employee = db.model('Employee', employeeSchema);

module.exports = Employee;