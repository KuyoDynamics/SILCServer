const auth_skip_path_matcher = require('./skip_request_path_matcher');
const {extract_token} = require('./jwt_auth_header_token_extractor');
const {verify_token} = require('./jwt_auth_token_verifier');

async function require_authentication(req, res, next) {
    try {
        let skip = auth_skip_path_matcher(req.path);
        if(skip){
            return next();
        }
        else {
            let token = extract_token(req);
            if(token != null)
            {
                let verified_token = await verify_token(req, token) ;
                if(verified_token){
                    req.user = verified_token;
                    next();
                }
                else{
                    res.status(403);
                    throw new Error('Access forbiden');
                }
            } else{
                res.status(403);
                throw new Error('Access forbiden');
            }
        }    
    } catch (error) {
        res.status(403);
        return next(error);
    }
}

module.exports = {
    require_authentication
}