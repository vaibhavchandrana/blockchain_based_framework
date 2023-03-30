const crypto = require("crypto");

var hash="sha256";
var message='[{  "color": "red","value": "hdbhdj" },{  "color": "red","value": "hdbhdj" },{  "color": "red","value": "hdbhdj"},{  "color": "red","value": "hdbhdj" }]';
	
var curve="secp256k1";

var args = process.argv;
if (args.length>2) message=args[2];
if (args.length>3) curve=args[3];
if (args.length>4) hash=args[4];

const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: curve,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  console.log("Private key:\n",privateKey.toString('base64'));
  console.log("Public key:\n",publicKey.toString('base64'));

const sign =  crypto.createSign(hash);

sign.write(message);
sign.end();
var signature = sign.sign(privateKey, 'hex');

const verify = crypto.createVerify(hash);
verify.write(message);
verify.end();

console.log("Message:\t",message);
console.log("Hash:\t\t",hash);
console.log("Curve:\t\t",curve);



console.log("\nSignature: ",signature.toString('hex'));


console.log("Signature verified: ",verify.verify(publicKey, signature, 'hex'));
