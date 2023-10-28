const express = require('express');
const router = express.Router();
const Employee = require('../models/EmployeeModel');
const Department = require('../models/DepartmentModel');

// Create a new employee
// Create a new employee with derived years of experience
router.post('/', async (req, res) => {
  try {
    const employeeData = req.body;
    const dateOfJoining = new Date(employeeData.dateOfJoining);
    const currentDate = new Date();
    const yearsOfExperience = Math.floor((currentDate - dateOfJoining) / (365 * 24 * 60 * 60 * 1000));

    // Add the derived years of experience to the employee data
    employeeData.yearsOfExperience = yearsOfExperience;

    const employee = new Employee(employeeData);

    // If a department is specified in the request, associate the employee with the department
    if (employeeData.departmentId) {
      const department = await Department.findById(employeeData.departmentId);
      if (department) {
        employee.department = department._id;
      }
    }

    await employee.save();
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

// Assign an employee to a department using request body
router.post('/assign', async (req, res) => {
  const { employeeId, departmentId } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).send('Employee not found');
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).send('Department not found');
    }

    // Check if the employee is already assigned to a department
    if (employee.department) {
      return res.status(400).send('Employee is already assigned to a department');
    }

    department.employees.push(employeeId);
    employee.department = departmentId;

    await department.save();
    await employee.save();

    res.send({ message: 'Employee assigned to department successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});



// Add a route to promote an employee to a manager of a specific department
router.post('/promote', async (req, res) => {
  const { employeeId, departmentId } = req.body;

  try {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).send('Employee not found');
    }

    if (employee.yearsOfExperience < 5) {
      return res.status(400).send('Employee does not meet the experience requirement for promotion');
    }

    // Check if the employee is already a manager of any department
    if (employee.isManager) {
      return res.status(400).send('Employee is already a manager');
    }

    // Find the specified department by ID
    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).send('Department not found');
    }

    // Check if the department already has a manager
    if (department.managerId) {
      return res.status(400).send('Department already has a manager');
    }

    // Promote the employee to manager of the specified department
    department.managerId = employeeId;
    employee.isManager = true;

    await department.save();
    await employee.save();

    res.send({ message: 'Employee promoted to manager successfully', department });
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;
