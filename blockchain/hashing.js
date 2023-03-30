const crypto =require('crypto')

exports.cryptohash = (...inputs)=>{    // using spread operator
    const hash =crypto.createHash('sha256') // using hash algo sha 256
    hash.update(inputs.sort().join(''))// join all input in one string and sort to generate hex all time 
    return hash.digest('hex') // convert hash value in hexadecimal
}

