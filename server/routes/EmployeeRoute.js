const express = require('express');
const router = express.Router();
const Employee = require('../models/EmployeeModel');
const Department = require('../models/DepartmentModel');

// Create a new employee
router.post('/', async (req, res) => {
    try {
      const employee = new Employee(req.body);
      await employee.save();
  
      // If a departmentId is provided in the request body, associate the employee with the department.
      if (req.body.departmentId) {
        const department = await Department.findById(req.body.departmentId);
  
        if (department) {
          department.employees.push(employee);
          await department.save();
        }
      }
  
      res.status(201).send(employee);
    } catch (error) {
      res.status(400).send(error);
    }
  });

// Retrieve all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.send(employees);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Retrieve an employee by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).send('Not found');
    }
    res.send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an employee by ID
router.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    const employee = await Employee.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!employee) {
      return res.status(404).send('Not found');
    }
    res.send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an employee by ID
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).send('Not found');
    }
    res.send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Assign an employee to a department
router.post('/:employeeId/assign/:departmentId', async (req, res) => {
  const employeeId = req.params.employeeId;
  const departmentId = req.params.departmentId;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).send('Employee not found');
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).send('Department not found');
    }

    department.employees.push(employeeId);
    await department.save();

    res.send({ message: 'Employee assigned to department successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
