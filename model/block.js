const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlockSchema = new Schema({
    blockVersion: Number,
    timestamp: Number,
    prevHash: String,
    hash: String,
    data:String, 
    publicKey: String,
    signature: String
});
exports.Block1 = mongoose.model('Block', BlockSchema);