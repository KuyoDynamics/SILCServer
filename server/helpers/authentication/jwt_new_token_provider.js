const jwt = require('jsonwebtoken');

async function jwt_new_token_provider(req, res, next) {
    try {
        let user = req.user;
        let API_SECRET = process.env.API_SECRET;
        let API_TOKEN_ISSUER = process.env.API_TOKEN_ISSUER;
        let API_TOKEN_ALGORITHM = process.env.API_TOKEN_ALGORITHM;
        let API_TOKEN_EXPIRES_IN = process.env.API_TOKEN_EXPIRES_IN;

        let payload = {
            sub: user._id,
            user_type: user.user_type,
            scope: user.user_permissions,
        };
        
        let signing_options = {
            issuer: API_TOKEN_ISSUER,
            audience: req.hostname,
            algorithm: API_TOKEN_ALGORITHM,
            expiresIn: API_TOKEN_EXPIRES_IN          
        };

        let token = await jwt.sign(payload, API_SECRET, signing_options);
        res.json({
            token
        });
        
        res.status(200).send();
        return;    
    } catch (error) {
        next(error);        
    }    
}

module.exports = {
    jwt_new_token_provider
}