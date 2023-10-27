const express = require('express');
const router = express.Router();
const Department = require('../models/DepartmentModel');

// Create a new department
router.post('/', async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).send(department);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Retrieve all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find();
    res.send(departments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Retrieve a department by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).send('Not found');
    }
    res.send(department);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a department by ID
router.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    const department = await Department.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!department) {
      return res.status(404).send('Not found');
    }
    res.send(department);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a department by ID
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).send('Not found');
    }
    res.send(department);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
