require("dotenv").config();
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const employeeRouter = require("./routes/employee");
const authRouter = require("./routes/authentication");
// const userRouter = require('./routes/user')
const jwt = require("jsonwebtoken");
//middle wares
const auth = (req, res, next) => {
  try {
    const token = req.get("Authorization").split("Bearer ")[1];
    console.log(token);
    var decoded = jwt.verify(token, process.env.secretKey);
    if (decoded.empId) {
      next();
    } else {
      return res.sendStatus(401);
    }
    console.log(decoded);
  } catch (err) {
    return res.sendStatus(401);
  }
};

server.use(express.json());

server.use("/auth", authRouter.router);
server.use("/employee", employeeRouter.router);

//db connection
main().catch((err) => console.log(err));

async function main() {
  // connect to the first database
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to first database");
}

server.listen(process.env.PORT, () => {
  console.log("server started");
});
