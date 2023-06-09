const model = require("../model/employee");
const model2 = require("../model/home");
const Employee = model.Employee;
const Home = model2.Home;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.createEmployee = async (req, res) => {
  try {
    const { empId, password } = req.body;
    var tok = jwt.sign({ empId: req.body.empId }, process.env.secretKey);
    var hashPassword = await bcrypt.hash(password, 10);
    req.body.password = hashPassword;
    console.log(hashPassword);
    var query1 = await Employee.findOne({ empId: empId }).exec();
    if (query1) {
      return res.status(400).json({ message: "Employee  already exist" });
    }
    var query = await Employee.findOne({ email: req.body.email }).exec();
    if (query) {
      return res.status(400).json({ message: "Employee  already exist" });
    }
    const emp = new Employee(req.body);
    emp
      .save()
      .then((result) => {
        return res.status(200).json({ token: tok, employee: true });
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.loginEmployee = async (req, res) => {
  try {
    var eId = req.body.empId;
    var password = req.body.password;
    var tok = jwt.sign(
      { ownerEmail: req.body.ownerEmail },
      process.env.secretKey
    );
    var query = await Employee.findOne({ empId: eId }).exec();
    if (query) {
      const result = await bcrypt.compare(password, query.password);
      if (result) {
        return res.status(200).json({
          message: "Login Successfull",
          token: tok,
          employee: true,
          empId:query.empId
        });
      } else {
        return res.status(401).json({ message: "password is incorrect" });
      }
    } else {
      return res.status(404).json({ message: "Employee does not exist" });
    }
  } catch (err) {
    return res.status(401).send(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    var ownerEmail = req.body.ownerEmail;
    var password = req.body.password;
    var tok = jwt.sign(
      { ownerEmail: req.body.ownerEmail },
      process.env.secretKey
    );
    var query = await Home.findOne({ ownerEmail: ownerEmail }).exec();
    if (query) {
      const result = await bcrypt.compare(password, query.password);
      if (result) {
        return res.status(200)
          .json({ message: "welcome to website", token: tok, employee: false,houseNo:query.houseNo,email:query.ownerEmail })
          ;
      } else {
        return res.status(401).json({ message: "password is incorrect" });
      }
    } else {
      return res.status(404).json({ message: "Employee does not exist" });
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};
exports.changeUserPass = async (req, res) => {
  try {
    var ownerEmail = req.body.ownerEmail;
    var old_password = req.body.oldPassword;
    var query = await Home.findOne({ ownerEmail: ownerEmail }).exec();
    if (query) {
      const result = await bcrypt.compare(old_password, query.password);
      if (result) {
        var hashPassword = await bcrypt.hash(req.body.newPassword, 10);
        query.password = hashPassword;
        await query.save();
        return res.status(200).json({ message: "password Changed sucessfully" });
      } else {
        return res.status(401).json({ message: "Incorrect old password" });
      }
    } else {
      return res.status(404).json({ message: "Email does not exist" });
    }
  } catch (err) {
    return res.status(401).send(err);
  }
};
