const mongoose = require("mongoose");
const { Schema } = mongoose;

const HomeSchema = new mongoose.Schema({
  houseNo: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerEmail: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  ownerPhone: {
    type: String,
    required: true,
    match: /^\d{10}$/,
  },
  numOfHouseMembers: {
    type: Number,
    required: true,
    min: 1,
  },
  numOfRooms: {
    type: Number,
    required: true,
    min: 1,
  },
  areaOfHouse: {
    type: Number,
    required: true,
    min: 1,
  },
  numOfRoomsOnRent: {
    type: Number,
    required: true,
    min: 0,
  },
  numOfVehicles: {
    type: Number,
    required: true,
    min: 0,
  },
  ownerType: {
    type: String,
    required: true,
  },
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Society",
    required: true,
  },
  publicKey: String,
  privateKey: String,
  electricityDetails: {
    type: [],
    required: true,
  },
  waterDetails: {
    type: [],
    required: true,
  },
  password: { type: String, required: true },
});

const SocietySchema = new Schema({
  societyNumber: String,
  societyName: String,
  city: String,
  pincode: String,
  street: String,
  state: String,
});
exports.Home = mongoose.model("Home", HomeSchema);
exports.Society = mongoose.model("Society", SocietySchema);
