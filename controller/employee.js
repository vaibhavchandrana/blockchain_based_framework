const model = require('../model/employee')
const Employee = model.Employee;
// const cors = require('cors');
// //view
// exports.getAllProductsSSR = async (req, res) => {
//   const products = await Product.find();
//   ejs.renderFile(path.resolve(__dirname,'../pages/index.ejs'), {products:products}, function(err, str){
//     res.send(str);
//  });

// };

// exports.getAddForm = async (req, res) => {
//   ejs.renderFile(path.resolve(__dirname,'../pages/add.ejs'), function(err, str){
//     res.send(str);
//  });

// };



// Create


exports.getAllEmployee = async (req, res) => {
    const products = await Employee.find();
    res.json(products);
};

// exports.getProduct = async (req, res) => {
//   const id = req.params.id;
//   console.log({id})
//   const product = await Product.findById(id);
//   res.json(product);
// };
// exports.replaceProduct = async (req, res) => {
//   const id = req.params.id;
//   try{
//   const doc = await Product.findOneAndReplace({_id:id},req.body,{new:true})
//   res.status(201).json(doc);
//   }
//   catch(err){
//     console.log(err);
//     res.status(400).json(err);
//   }
// };
// exports.updateProduct = async (req, res) => {
//   const id = req.params.id;
//   try{
//   const doc = await Product.findOneAndUpdate({_id:id},req.body,{new:true})
//   res.status(201).json(doc);
//   }
//   catch(err){
//     console.log(err);
//     res.status(400).json(err);
//   }
// };
// exports.deleteProduct = async (req, res) => {
//   const id = req.params.id;
//   try{
//   const doc = await Product.findOneAndDelete({_id:id})
//   res.status(201).json(doc);
//   }
//   catch(err){
//     console.log(err);
//     res.status(400).json(err);
//   }
// };