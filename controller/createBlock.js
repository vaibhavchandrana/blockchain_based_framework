const { Block, Block2, Block3, Block4 } = require("../model/block");
const findHash = require("../blockchain/puzzle");
const { encrypt, decrypt } = require("eciesjs");
const { consensusVoting } = require("../blockchain/consensusProtocol");
var EC = require("elliptic").ec;
exports.createGenesisBlock = async (req, res) => {
  var block = new Block();
  (block.blockVersion = 0),
    (block.timestamp = Date.now()),
    (block.prevHash = "0000"),
    (block.hash =
      "0005ce01225fe70ffbdaf3c909ef159dcd35638167ff2f77590ff9baec39b372"),
    (block.data = "genesis block");
  block.save();
  const block2 = new Block2(block);
  const block3 = new Block3(block);
  const block4 = new Block4(block);
  block2.save();
  block4.save();
  block3.save();
  return res.json("genesis added");
};
exports.createBlock = async (data, publickey, privateKey) => {
  try {
    var datajson = JSON.stringify(data);
    console.log("data recieved is ", datajson);
    const queryData = await Block.find();
    var len = queryData.length;
    var lastBlock = queryData[len - 1];
    var block = new Block();
    block.prevHash = lastBlock.hash;
    block.blockVersion = lastBlock.blockVersion + 1;
    var blockVersion = lastBlock.blockVersion + 1;
    const ciphertext = encrypt(publickey, Buffer.from(datajson));
    console.log("encypted text is ", ciphertext);
    block.data = ciphertext.toString("hex");
    var timestamp = Date.now();
    block.timestamp = timestamp;
    block.publicKey = publickey;
    const sign = new EC("secp256k1").sign(
      Buffer.from(block.data),
      privateKey,
      "hex",
      {
        canonical: true,
      }
    );
    // Get the signature as a hex string
    const signature = sign.toDER("hex");
    block.signature = signature;
    block.hash = findHash.puzzleFxn(
      blockVersion,
      timestamp,
      lastBlock.prevHash,
      ciphertext.toString("hex"),
      publickey
    );
    const consensus = await consensusVoting(queryData, block);
    if (consensus == true) {
      block.save();
      const block2 = new Block2(block);
      const block3 = new Block3(block);
      const block4 = new Block4(block);
      block2.save();
      block4.save();
      block3.save();
      console.log("consessus passed");
      return blockVersion;
    } else {
      console.log("consensus failed");
      return 0;
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
};

exports.getBlockData = async (block_version, privateKey) => {
  try {
    const block = await Block.findOne({ blockVersion: block_version });
    const encryptedData = block.data;
    // console.log("data is", encryptedData.toString("hex"));
    const decryptedData = decrypt(
      privateKey,
      Buffer.from(encryptedData, "hex")
    ).toString();
    const originalData = JSON.parse(decryptedData);
    return originalData;
  } catch (err) {
    return err;
  }
};
