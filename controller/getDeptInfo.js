const model = require("../model/home");
const empModel=require("../model/employee")
const BlockModel=require("../model/block")
const Employee=empModel.Employee
const Block=BlockModel.Block
const createBlock = require("./createBlock");
const Home = model.Home;
const Society=model.Society

//return details of electricity department like acount number
exports.getElectricityDetailMain = async (req, res) => {
  try {
    const houseNo = req.params.houseNo;
    const home = await Home.findOne({ houseNo });
    const electricDetailBlockVer = Number(await home.electricityDetails[0]);
    const prvtKey = home.privateKey;
    const electricAccountData = await createBlock.getBlockData(
      electricDetailBlockVer,
      prvtKey
    );
    console.log(electricAccountData);
    return res.status(200).json(electricAccountData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getWaterDetailMain = async (req, res) => {
  try {
    const houseNo = req.params.houseNo;
    const home = await Home.findOne({ houseNo: houseNo });
    const waterDetailBlockVer = Number(await home.waterDetails[0]);
    const prvtKey = home.privateKey;
    console.log(prvtKey, waterDetailBlockVer);
    const waterAccountData = await createBlock.getBlockData(
      waterDetailBlockVer,
      prvtKey
    );
    return res.status(200).json(waterAccountData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.getHomesUnderState = async (req, res) => {
  try {
    const state = req.params.state.toLowerCase(); // Convert state to lowercase for case-insensitive search
    const homes = await Home.find({ 'society.state': { $regex: state, $options: 'i' } }).populate('society');
    res.status(200).json(homes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.getHomesBasedOnSearch = async (req, res) => {
  const query  = req.params.searchString;
 console.log(query)
  try {
    const homes = await Home.find({
      $or: [
        { ownerName: { $regex: query, $options: 'i' } },
        { houseNo: { $regex: query, $options: 'i' } }
      ]
    }).populate('society');

    res.json(homes );
  } catch (error) {
    console.error('Error searching homes:', error);
    res.status(500).json({ error: 'Error searching homes' });
  }
};

exports.getStatics = async (req, res) => {
  try {
    // Find the count of homes
    const homeCount = await Home.countDocuments();
    const empCount = await Employee.countDocuments();
    const BlockCount = await Block.countDocuments();
    const societyCount = await Society.countDocuments();
    res.status(200).json({ homeCount: homeCount,employeeCount:empCount,blockCount:BlockCount,societyCount:societyCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getEmployeeDetailById=async(req,res)=>{
  try {
    const empId = req.params.empId;
    const employee = await Employee.findOne({ empId });

    // If the Home object is not found, return 404 error
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    } else {
      return res.status(200).json(employee);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}