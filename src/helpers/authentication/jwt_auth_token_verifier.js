let jwt = require('jsonwebtoken');

function verify_token(req, token) {
    let API_SECRET = process.env.API_SECRET;
    let API_TOKEN_ISSUER = process.env.API_TOKEN_ISSUER;
    let API_TOKEN_ALGORITHM = process.env.API_TOKEN_ALGORITHM;
    let API_TOKEN_EXPIRES_IN = process.env.API_TOKEN_EXPIRES_IN;

    let verifyOptions = {
            issuer: API_TOKEN_ISSUER,
            audience: req.hostname,
            algorithm: [API_TOKEN_ALGORITHM],
            expiresIn: API_TOKEN_EXPIRES_IN  
    }
    return new Promise( (resolve, reject)=>{
        try {
            let result = jwt.verify(token, API_SECRET, verifyOptions);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    verify_token
}