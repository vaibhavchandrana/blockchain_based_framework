require('dotenv').config()
const express = require('express');
const server = express();
const mongoose = require('mongoose')
const employeeRouter = require('./routes/employee')
const authRouter = require('./routes/authentication')
// const userRouter = require('./routes/user')
const jwt = require('jsonwebtoken')

//middle wares
const auth = (req, res, next) => {
  try {

    const token = req.get('Authorization').split('Bearer ')[1]
    console.log(token)
    var decoded = jwt.verify(token, process.env.secretKey)
    if (decoded.empId) {
      next()
    }
    else {
      res.sendStatus(401)
    }
    console.log(decoded)
  }
  catch (err) {
    res.sendStatus(401);
  }
}

server.use(express.json());


server.use('/auth', authRouter.router);
server.use('/employee', auth, employeeRouter.router);
// server.use('/users',userRouter.router);


//db connection
main().catch(err => console.log(err));

async function main() {
  

  // connect to the first database
 await mongoose.createConnection(process.env.MONGO_URL)
    console.log('Connected to first database');
    

  // // connect to the second database
  // var conn2=await  mongoose.createConnection('mongodb+srv://naudiyalmitul:Cru1v0cJU6iVYgJA@cluster0.zwurjh3.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true })
  // console.log('Connected to second database')
  
  // //conect to third database
  // var conn3=await  mongoose.createConnection('mongodb+srv://naudiyalmitul:Cru1v0cJU6iVYgJA@cluster0.zwurjh3.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true })
  // console.log('Connected to third database')

  // //connect to fourth databases
  // var conn4=await  mongoose.createConnection('mongodb+srv://dhimanmukul307:OaX7Ifm3uEukx5CL@cluster0.jz9izpp.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true })
  // console.log('Connected to fourth database')
}

server.listen(process.env.PORT, () => {
  console.log('server started');
});

