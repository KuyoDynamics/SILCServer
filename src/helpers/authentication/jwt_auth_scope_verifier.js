const auth_skip_path_matcher = require('./skip_request_path_matcher');
const error = res => res.status(403).send('Insufficient scope');

module.exports =  expectedScopes => {
    if(!Array.isArray(expectedScopes)){
        throw new Error(
            'Parameter expectedScopes must be an array of strings representing the scopes for the endpoints'
        );
    }

    return (req, res, next) => {
       
        if( auth_skip_path_matcher(req.originalUrl)){
            return next();
        }
        if(expectedScopes.length === 0){
            return next();
        }
        console.log('is req.user.scope: array', Array.isArray(req.user.scope));
        if(!req.user || !Array.isArray(req.user.scope)){
            return error(res);
        }

        const scopes = req.user.scope;
        const allowed = expectedScopes.some(scope => scopes.includes(scope));

        return allowed ? next() : error(res);
    };
}