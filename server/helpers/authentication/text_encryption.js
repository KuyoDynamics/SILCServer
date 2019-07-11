const crypto = require('crypto');
const KEY = crypto.scryptSync(String(process.env.CRYPTO_PASSWORD), 'salt',24);
const IV = Buffer.alloc(16,0); //Initialization vector

function encryptText(text){
    const cipher =  crypto.createCipheriv(String(process.env.CRYPTO_ALGORITHM), KEY, IV);
    let encrypted = cipher.update(text, 'utf8','hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decryptText(text){
    const  decipher = crypto.createDecipheriv(String(process.env.CRYPTO_ALGORITHM), KEY, IV);
    let decrypted  = decipher.update(text,'hex','utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    encryptText,
    decryptText
}