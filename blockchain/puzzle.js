const hash=require('./hashing')

 exports.puzzleFxn = (...inputs) => {
    const target = "001523940c831070fa5cf5b53e12abe43f32b17bc06d8c40025a154e0ea61f53";
    do {

        var nonce = Math.random() * 100000000;
        var calculatedHash = hash.cryptohash(inputs, nonce);
    } 
    while (calculatedHash > target);

    console.log("answer found ", calculatedHash);
    return calculatedHash;
}
