const express = require('express');
const employeeController = require('../controller/employee');
const router = express.Router();

router
  .get('/get', employeeController.getAllEmployee)
  //.get('/:id', employeeController.getAllEmployee)
  // .put('/:id', employeeController.replaceUser)
  // .patch('/:id', employeeController.updateUser)
  // .delete('/:id', employeeController.deleteUser);

exports.router = router; 