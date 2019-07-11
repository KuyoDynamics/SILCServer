let User = require('../models/user.model');
const {extract_credentials} = require('../../../helpers/authentication/jwt_auth_header_token_extractor');

async function login(req, res, next) {
    try {
        let credentials = extract_credentials(req);
        let password;
        let username;

        if(!credentials){
            let {params_username, params_password} = (Object.keys(req.query).length === 0) ? req.body : req.query; 
            if(typeof user_name === 'undefined' && typeof pass_word === 'undefined'){
                throw new Error('Username and password required!');
            }
            else{
                username = params_username;
                password = params_password;
            }
        }
        else{
            password = credentials.password;
            username = credentials.username;
        }

        let reasons =  User.failedLoginReasons;

        let user = await User.findOne({'username': username});
        
        if(user){
            if(user.isLocked){
                user.incLoginAttempts(function(err) {
                    if(err){
                        console.log('Error incrementing login attempts: ', err);
                    }
                });
                throw new Error(reasons.MAX_ATTEMPTS);
            }
            let isMatch = await user.comparePassword(password, user.password);
            if(!isMatch){
                user.incLoginAttempts(function(err) {
                    if(err){
                        console.log('Error incrementing login attempts: ', err);
                    }
                });
                throw new Error(reasons.PASSWORD_INCORRECT);
            }
            if(isMatch){
                if(!user.login_attempts && !user.lock_until){
                    req.user = user; //send user for jwt signing/jwt_login_token_provider
                    return next();
                }
                //reset attempts and lock info
                let updates = {
                    $set: { login_attempts: 0},
                    $unset: { lock_until: 1}
                };

                let updated_user = await User.findOneAndUpdate({'_id': user._id}, updates,{"new": true});
                req.user = updated_user;
                return next();
            }
        }
        else {
            //get clever and deny that IP further requests for 24hrs, i.e, rate limit
            throw new Error(reasons.NOT_FOUND);
        }
    } catch (error) {
        res.status(401);
        return next(error);
    }
}

module.exports = {
    login
}