const model = require("../model/home");
const createBlock = require("./createBlock");
const Society = model.Society;
const Home = model.Home;
const { ec } = require("elliptic");
const curve = new ec("secp256k1");

// Create an object with the email data:

exports.transactionForWaterPayment = async (req, res) => {
  try {
    const { houseNo } = req.body;
    // add reference to home schema
    const home = await Home.findOne({ houseNo: req.body.houseNo });
    const blockVersion = await createBlock.createBlock(
      req.body,
      home.publicKey,
      home.privateKey
    );
    if (blockVersion == 0) {
      res.status(500).json({ errors: "Consensus failed" });
    } else {
      home.waterDetails.push(blockVersion);
      await home.save();
      res.status(200).json({ message: "Details added" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Some error occured"] });
  }
};

exports.transactionForElectricityPayment = async (req, res) => {
  try {
    const { houseNo } = req.body;
    // add reference to home schema
    const home = await Home.findOne({ houseNo: req.body.houseNo });
    const blockVersion = await createBlock.createBlock(
      req.body,
      home.publicKey,
      home.privateKey
    );
    if (blockVersion == 0) {
      res.status(500).json({ errors: "Consensus failed" });
    } else {
      home.electricityDetails.push(blockVersion);
      await home.save();
      res.status(200).json({ message: "Details added" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Some error occured"] });
  }
};
exports.getAllTransactionForElectrictyPayments = async (req, res) => {
  try {
    const houseNo = req.body.houseNo;
    const home = await Home.findOne({ houseNo: houseNo });
    const electricDetailBlockVer = await home.electricityDetails;
    const prvtKey = home.privateKey;
    var allPayments = [];
    for (let i = 1; i < electricDetailBlockVer.length; i++) {
      const electricAccountData = await createBlock.getBlockData(
        electricDetailBlockVer[i],
        prvtKey
      );
      allPayments.push(electricAccountData);
    }
    console.log(allPayments);
    return res.json(allPayments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.getAllTransactionForWaterPayments = async (req, res) => {
  try {
    const houseNo = req.body.houseNo;
    const home = await Home.findOne({ houseNo: houseNo });
    const electricDetailBlockVer = await home.waterDetails;
    const prvtKey = home.privateKey;
    var allPayments = [];
    for (let i = 1; i < electricDetailBlockVer.length; i++) {
      const electricAccountData = await createBlock.getBlockData(
        electricDetailBlockVer[i],
        prvtKey
      );
      allPayments.push(electricAccountData);
    }
    console.log(allPayments);
    return res.json(allPayments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
