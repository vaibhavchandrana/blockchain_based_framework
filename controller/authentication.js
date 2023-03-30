const model = require('../model/employee')
const fs = require('fs')
const Employee = model.Employee;
require('dotenv').config()
const jwt = require('jsonwebtoken')
const path = require('path')
const privatekey = fs.readFileSync(path.resolve(__dirname, '../private.key'), 'utf-8')
const bcrypt = require("bcrypt")

exports.createEmployee = async (req, res) => {
    const {password} = req.body;
    var tok = jwt.sign({ empId: req.body.empId },process.env.secretKey )
    var hashPassword= await bcrypt.hash(password, 10)
    req.body.password=hashPassword 
    console.log(hashPassword)
    const emp = new Employee(req.body); 
    emp.save() 
        .then((result) => {
            res.status(201).json({"token":tok});
        })
        .catch((err) => {
            res.status(400).json(err);
        })

};

exports.loginEmployee = async (req, res) => {
    var eId=req.body.empId
    var password=req.body.password
    try{
    var query= await Employee.findOne({ empId: eId }).exec();
    if(query)
    {
       const result = await bcrypt.compare(password, query.password);
       if(result)
       {
        res.json({"message":"welcome to website"}).sendStatus(200)
       }
       else{
        res.sendStatus(401)
       }
    }
    else{
        res.sendStatus(401)
    }
    }
    catch(err)
    {
        res.send(err)
    }
};