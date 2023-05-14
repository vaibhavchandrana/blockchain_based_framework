const model = require("../model/home");
const createBlock = require("./createBlock");
const Home = model.Home;

//return details of electricity department like acount number
exports.getElectricityDetailMain = async (req, res) => {
  try {
    const houseNo = req.body.houseNo;
    const home = await Home.findOne({ houseNo: houseNo });
    const electricDetailBlockVer = Number(await home.electricityDetails[0]);
    const prvtKey = home.privateKey;
    const electricAccountData = await createBlock.getBlockData(
      electricDetailBlockVer,
      prvtKey
    );
    console.log(electricAccountData);
    return res.json(electricAccountData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getWaterDetailMain = async (req, res) => {
  try {
    const houseNo = req.body.houseNo;
    const home = await Home.findOne({ houseNo: houseNo });
    const waterDetailBlockVer = Number(await home.waterDetails[0]);
    const prvtKey = home.privateKey;
    console.log(prvtKey, waterDetailBlockVer);
    const waterAccountData = await createBlock.getBlockData(
      waterDetailBlockVer,
      prvtKey
    );
    return res.json(waterAccountData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
