const express = require("express");
const employeeAuthController = require("../controller/authentication");
const router = express.Router();

router
  .post("/registration", employeeAuthController.createEmployee)
  .post("/login", employeeAuthController.loginEmployee)
  .post("/user/login", employeeAuthController.loginUser)
  .post("/user/change_password", employeeAuthController.changeUserPass)

exports.router = router;
