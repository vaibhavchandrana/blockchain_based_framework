const model = require("../model/employee");
const model2 = require("../model/home");
const Employee = model.Employee;
const Home = model2.Home;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


exports.createEmployee = async (req, res) => {
  const { password } = req.body;
  var tok = jwt.sign({ empId: req.body.empId }, process.env.secretKey);
  var hashPassword = await bcrypt.hash(password, 10);
  req.body.password = hashPassword;
  console.log(hashPassword);
  const emp = new Employee(req.body);
  emp
    .save()
    .then((result) => {
      res.status(201).json({ token: tok });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.loginEmployee = async (req, res) => {
  var eId = req.body.empId;
  var password = req.body.password;
  try {
    var tok = jwt.sign(
      { ownerEmail: req.body.ownerEmail },
      process.env.secretKey
    );
    var query = await Employee.findOne({ empId: eId }).exec();
    if (query) {
      const result = await bcrypt.compare(password, query.password);
      if (result) {
        res.json({ message: "Login Successfull", token: tok }).sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.send(err);
  }
};

exports.loginUser = async (req, res) => {
  var ownerEmail = req.body.ownerEmail;
  var password = req.body.password;
  try {
    var tok = jwt.sign(
      { ownerEmail: req.body.ownerEmail },
      process.env.secretKey
    );
    var query = await Home.findOne({ ownerEmail: ownerEmail }).exec();
    if (query) {
      const result = await bcrypt.compare(password, query.password);
      if (result) {
        res.json({ message: "welcome to website", token: tok }).sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.send(err);
  }
};
exports.changeUserPass = async (req, res) => {
  var ownerEmail = req.body.ownerEmail;
  var old_password = req.body.oldPassword;
  try {
    var query = await Home.findOne({ ownerEmail: ownerEmail }).exec();
    if (query) {
      const result = await bcrypt.compare(old_password, query.password);
      if (result) {
        var hashPassword = await bcrypt.hash(req.body.newPassword, 10);
        query.password = hashPassword;
        await query.save();
        res.json({ message: "password Changed sucessfully" });
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.send(err);
  }
};
