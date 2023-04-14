const model = require('../model/block')
const findHash=require('../blockchain/puzzle')
const Block = model.Block;
const { encrypt, decrypt, PrivateKey }=require('eciesjs');
var EC = require('elliptic').ec;
var curve = new EC('secp256k1');
var privateKey= new PrivateKey();
var publickey=privateKey.publicKey.toHex();
var prvk=privateKey.toHex();


exports.createBlock = async (req, res) => {
    const queryData=await Block.find()
    var len=queryData.length
    var lastBlock=queryData[len-1]
    var block=new model.Block()
    block.prevHash=lastBlock.hash
    block.blockVersion=lastBlock.blockVersion+1
    var blockVersion=lastBlock.blockVersion+1
    data=req.body.data
    const cipherInterText=Buffer.from(data)
    const ciphertext=encrypt(publickey, cipherInterText).toString()
    block.data=ciphertext
    var timestamp=Date.now()
    block.timestamp=timestamp
    var publicKey=publickey
    block.publicKey=publicKey
    block.signature="this is my signature"
    block.hash=findHash.puzzleFxn(blockVersion,timestamp,lastBlock.prevHash,data,publicKey)
    block.save()

    res.sendStatus(200);
};


exports.mineBlock=async(req,res)=>{

    const block = new Block(req.body)
    const queryData=Block.find()
    block.save()
    res.sendStatus(200);
}


exports.getBlock=async(req,res)=>{
    const queryData=await Block.find()
    var len=queryData.length
    console.log("length is "+len)
    console.log(queryData[2].data)
    res.json(queryData)
}
