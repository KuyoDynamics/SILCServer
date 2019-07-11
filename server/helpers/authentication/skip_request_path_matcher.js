/**
 * jwt_token_auth_processing_filter is configured to skip the following endpoints:
 * /api/auth/login and /api/auth/token
 * This is achieved with skip_path_request_matcher implementation of request_matcher
 */ 
let skip_path_patterns = require('./auth_skip_paths_config');

function skipRequestPathMatcher(req_path) {
    let skipped = false;
    for(let i = 0;i<skip_path_patterns.length;i++){
         skipped = skip_path_patterns[i].test(req_path);
        if(skipped) {
            break;
        }
    }
    console.log('Auth Skipped : ', skipped);
    return skipped;
}

module.exports = skipRequestPathMatcher