const express = require("express");
const completeProfile = require("../controller/completeProfile");
const getDeptData = require("../controller/getDeptInfo");
const transactions = require("../controller/transactions");
const blockController = require("../controller/createBlock");
const router = express.Router();

router
  .post("/add/society", completeProfile.createSociety)
  .get("/get/societies/all", completeProfile.getAllSociety)
  .post("/add/home", completeProfile.addHome)
  .get("/get/home/:houseNo", completeProfile.getOneHome)
  .get("/get/homes/all", completeProfile.getAllHome)
  .get("/society/houses/:society_id", completeProfile.getAllHomeInsideSociety)
  .post("/add/details/electricity", completeProfile.addElectricityDetails)
  .post("/add/details/water", completeProfile.addWaterAndSewageDetail)
  .get(
    "/get/details/electricity/:houseNo",
    getDeptData.getElectricityDetailMain
  )
  .get(
    "/get/statics",
    getDeptData.getStatics
  )
  .get(
    "/get/employee/:empId",
    getDeptData.getEmployeeDetailById
  )
  .get("/get/details/water/:houseNo", getDeptData.getWaterDetailMain)
  .post(
    "/add/transaction/electricity",
    transactions.transactionForElectricityPayment
  )
  .post("/add/transaction/water", transactions.transactionForWaterPayment)
  .get(
    "/get/transactions/electricity/all/:houseNo",
    transactions.getAllTransactionForElectrictyPayments
  )
  .get(
    "/get/transactions/water/all/:houseNo",
    transactions.getAllTransactionForWaterPayments
  )
  .get("/add_genesis", blockController.createGenesisBlock);

exports.router = router;
