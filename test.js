// Import the necessary libraries
const mongoose = require("mongoose");
const ecies = require("eciesjs");
require("dotenv").config();
const { ec } = require("elliptic");

// Define the schema for the encrypted data
const encryptedDataSchema = new mongoose.Schema({
  data: String,
});

// Define the model for the encrypted data
const EncryptedData = mongoose.model("EncryptedData", encryptedDataSchema);

// Connect to the MongoDB database
mongoose.connect(process.env.MONGO_URL);

// Define the data to be encrypted
const dj={
    "meterNumber": "123456789",
    "meterPower": 20,
    "accountHolderName": "Jannhre Smith",
    "accountHolderPhoneNumber": "9876555432",
    "powerCorporationName": "ABC Power Co.",
    "houseNo":"h12"
  }  
const plainText = JSON.stringify(dj);
const curve = new ec("secp256k1");
const privateKey = curve.genKeyPair().getPrivate().toString("hex");
const publicKey = curve
  .keyFromPrivate(privateKey)
  .getPublic()
  .encode("hex", true);

// Encrypt the data using ECIES
const encryptedData = ecies.encrypt(publicKey, Buffer.from(plainText));

// Save the encrypted data to MongoDB using Mongoose
const newEncryptedData = new EncryptedData({
  data: encryptedData.toString("hex"),
});
newEncryptedData.save();

// Retrieve the encrypted data from MongoDB using Mongoose
(async () => {
  try {
    const data = await EncryptedData.findOne();
    // Decrypt the data using ECIES
    const decryptedData = ecies
      .decrypt(privateKey, Buffer.from(data.data, "hex"))
      .toString();
    // Print the decrypted data
    console.log("Decrypted data: ", decryptedData);
  } catch (err) {
    console.error(err);
  }
})();
