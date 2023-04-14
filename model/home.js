const mongoose = require('mongoose');
const { Schema } = mongoose;

const HomeSchema = new Schema({
    houseNumber: String,
    society: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society'
      },
    prevHash: String,
    hash: String,
    data:String, 
    publicKey: String,
    privateKey: String,
    signature: String
});


const SocietySchema = new Schema({
    societyNumber: String,
    societyName:String ,
    city: String,
    pincode: String,
    street:String, 
    state: String
});
exports.Home = mongoose.model('Home', HomeSchema);
exports.Society = mongoose.model('Society', SocietySchema);

  