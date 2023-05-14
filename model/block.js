const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlockSchema = new Schema({
  blockVersion: Number,
  timestamp: Number,
  prevHash: String,
  hash: String,
  data: {
    type: String,
  },
  publicKey: String,
  signature: String,
});
exports.Block = mongoose.model("Block", BlockSchema);
exports.Block2 = mongoose.model("Block2", BlockSchema);
exports.Block3 = mongoose.model("Block3", BlockSchema);
exports.Block4 = mongoose.model("Block4", BlockSchema);

