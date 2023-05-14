const { Block, Block2, Block3, Block4 } = require("../model/block");
var EC = require("elliptic").ec;

function validateBlockChain(blockchain) {
  var check = true;
  for (let i = 0; i < blockchain.length - 1; i++) {
    if (blockchain[i + 1].prevHash != blockchain[i].hash) {
      check = false;
      break;
    }
  }
  return check;
}

function varifyHash(block) {
  const target =
    "001523940c831070fa5cf5b53e12abe43f32b17bc06d8c40025a154e0ea61f53";
  if (block.hash > target) {
    return false;
  }
  return true;
}

function varifySignature(block) {
  const varify = new EC("secp256k1").verify(
    Buffer.from(block.data),
    block.signature,
    block.publicKey,
    "hex"
  );
  return varify;
}
function compareBlockchainWithIncomingBlockchain(
  myBlockchain,
  otherBlockchain
) {
  try {
    if (myBlockchain.length == otherBlockchain.length) {
      let blockLength = myBlockchain.length;
      var check = true;
      for (let i = 0; i < blockLength; i++) {
        if (myBlockchain[i].hash != otherBlockchain[i].hash) {
          check = false;
          break;
        }
        if (myBlockchain[i].timestamp != otherBlockchain[i].timestamp) {
          check = false;
          break;
        }
        if (myBlockchain[i].publicKey != otherBlockchain[i].publicKey) {
          check = false;
          break;
        }
      }
      if (check) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
function consensusAlgorithm(blockchain, block, serverBlockchain) {
  if (block.data.length === 0) {
    return false;
  }
  if ( validateBlockChain(blockchain) == false) {
    return false;
  }
  if ( varifyHash(block) == false) {
    return false;
  }
  if ( varifySignature(block) == false) {
    return false;
  }
  if (
    compareBlockchainWithIncomingBlockchain(serverBlockchain, blockchain) ==
    false
  ) {
    return false;
  }
  return true;
}

exports.consensusVoting = async (blockchain, block) => {
  const blockchain1 = await Block.find();
  const blockchain2 = await Block2.find();
  const blockchain3 = await Block3.find();
  const blockchain4 = await Block4.find();
  var votes = 0;
  if (consensusAlgorithm(blockchain, block, blockchain1) == true) {
    console.log("server 1 voted");
    votes++;
  }
  if (consensusAlgorithm(blockchain, block, blockchain2) == true) {
    console.log("server 2 voted");
    votes++;
  }
  if (consensusAlgorithm(blockchain, block, blockchain3) == true) {
    console.log("server 3 voted");
    votes++;
  }
  if (consensusAlgorithm(blockchain, block, blockchain4) == true) {
    console.log("server 4 voted");
    votes++;
  }
  console.log("votes is ", votes);
  if (votes > 3) {
    return true;
  } else {
    return false;
  }
};
