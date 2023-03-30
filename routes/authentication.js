const express = require('express');
const employeeAuthController = require('../controller/authentication');
const blockController = require('../controller/createBlock');
const router = express.Router();

router
  .post('/registration', employeeAuthController.createEmployee)
  .post('/login',employeeAuthController.loginEmployee)
  .post('/add_block',blockController.createBlock)
  .get('/get_block',blockController.getBlock)


  exports.router = router; 