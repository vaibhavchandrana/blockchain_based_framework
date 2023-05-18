const model = require("../model/home");
const createBlock = require("./createBlock");
const Society = model.Society;
const Home = model.Home;
const { ec } = require("elliptic");
const curve = new ec("secp256k1");

function generateRandomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.createSociety = async (req, res) => {
  try {
    const { societyNumber, societyName, city, pincode, street, state } =
      req.body;
    // Validate the required fields
    if (
      !societyNumber ||
      !societyName ||
      !city ||
      !pincode ||
      !street ||
      !state
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const society = new Society({
      societyNumber,
      societyName,
      city,
      pincode,
      street,
      state,
    });

    const result = await society.save();
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
exports.getAllSociety = async (req, res) => {
  try {
    const societies = await Society.find();
    return res.json(societies);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.addHome = async (req, res) => {
  try {
    const privateKey = curve.genKeyPair().getPrivate().toString("hex");
    const publicKey = curve
      .keyFromPrivate(privateKey)
      .getPublic()
      .encode("hex", true);
    var password = generateRandomString(10);
    // console.log("Generated password is ", password);
    const newHome = new Home({
      houseNo: req.body.houseNo,
      ownerName: req.body.ownerName,
      ownerEmail: req.body.ownerEmail,
      ownerPhone: req.body.ownerPhone,
      numOfHouseMembers: req.body.numOfHouseMembers,
      numOfRooms: req.body.numOfRooms,
      areaOfHouse: req.body.areaOfHouse,
      numOfRoomsOnRent: req.body.numOfRoomsOnRent,
      numOfVehicles: req.body.numOfVehicles,
      ownerType: req.body.ownerType,
      society: req.body.society,
      publicKey: publicKey,
      privateKey: privateKey,
      password: password,
    });

    // Validate the new Home object before saving
    const errors = await newHome.validateSync();

    // If there are validation errors, return them to the client
    if (errors) {
      return res.status(400).json(errors);
    }

    // Save the new Home object to the database
    const savedHome = await newHome.save();
    return res.status(201).json(savedHome);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getOneHome = async (req, res) => {
  try {
    const home = await Home.findOne({ houseNo: req.body.houseNo }).populate(
      "society"
    );

    // If the Home object is not found, return 404 error
    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    } else {
      return res.json(home);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.getAllHomeInsideSociety = async (req, res) => {
  try {
    const houses = await Home.find({ society: req.body.society_id }).exec();
    return res.status(200).json(houses);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

exports.getAllHome = async (req, res) => {
  try {
    const home = await Home.find().populate("society");

    // If the Home object is not found, return 404 error
    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    }

    return res.json(home);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// function to validate electricity data
function validateElectricityData(data) {
  const errors = [];

  if (
    !data.meterNumber ||
    data.meterNumber.length < 5 ||
    data.meterNumber.length > 10
  ) {
    errors.push("Meter number must be between 5 and 10 characters");
  }

  if (
    !data.meterPower ||
    data.meterPower.length < 1 ||
    data.meterPower.length > 2
  ) {
    errors.push("Meter power must be between 1 and 2 characters");
  }

  if (
    !data.accountHolderName ||
    data.accountHolderName.length < 5 ||
    data.accountHolderName.length > 20
  ) {
    errors.push("Account holder name must be between 5 and 20 characters");
  }

  if (
    !data.accountHolderPhoneNumber ||
    data.accountHolderPhoneNumber.length !== 10
  ) {
    errors.push("Account holder phone number must be 10 digits");
  }

  if (
    !data.powerCorporationName ||
    data.powerCorporationName.length < 5 ||
    data.powerCorporationName.length > 20
  ) {
    errors.push("Power corporation name must be between 5 and 20 characters");
  }

  return errors;
}

exports.addElectricityDetails = async (req, res) => {
  try {
    const {
      meterNumber,
      meterPower,
      accountHolderName,
      accountHolderPhoneNumber,
      powerCorporationName,
    } = req.body;

    // validate request data
    const validationErrors = validateElectricityData(req.body);
    if (validationErrors.length) {
      return res.status(400).json({ errors: validationErrors });
    }
    // add reference to home schema
    const home = await Home.findOne({ houseNo: req.body.houseNo });
    console.log("req body is ", req.body);
    const blockVersion = await createBlock.createBlock(
      req.body,
      home.publicKey,
      home.privateKey
    );
    if (blockVersion == 0) {
      return res.status(500).json({ errors: ["Server error"] });
    }
    home.electricityDetails.push(blockVersion);
    await home.save();
    return res.status(200).json({ message: "Details added" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ["Some error is made"] });
  }
};

exports.addWaterAndSewageDetail = async (req, res) => {
  try {
    const {
      billNumber,
      waterUsageAmount,
      waterSource,
      fixedBill,
      billOwnerName,
      sewageDisposalMethod,
      houseNo,
    } = req.body;

    // validate request data

    // add reference to home schema
    const home = await Home.findOne({ houseNo: req.body.houseNo });
    const blockVersion = await createBlock.createBlock(
      req.body,
      home.publicKey,
      home.privateKey
    );
    if (blockVersion == 0) {
      return res.status(500).json({ errors: "Consensus failed" });
    } else {
      home.waterDetails.push(blockVersion);
      await home.save();
      return res.status(200).json({ message: "Details added" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ["Some error occured"] });
  }
};
