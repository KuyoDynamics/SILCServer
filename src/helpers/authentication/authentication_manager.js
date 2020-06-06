// const auth_skip_path_matcher = require('./skip_request_path_matcher'); Ignore this logic for now
const { extractToken } = require("./jwt_auth_header_token_extractor");
const { verifyToken } = require("./jwt_auth_token_verifier");

async function requireAuthentication(req, res, next) {
  try {
    // Ignore this skip logic for now

    // let skip = auth_skip_path_matcher(req.path);
    // if(skip){
    //     return next();
    // }
    // else {
    let token = extractToken(req);
    if (token != null) {
      let verified_token = await verifyToken(req, token);
      if (verified_token) {
        req.user = verified_token;
        next();
      } else {
        res.status(403);
        throw new Error("Access forbiden");
      }
    } else {
      res.status(403);
      throw new Error("Access forbiden");
    }
  } catch (error) {
    res.status(403);
    return next(error);
  }
}

module.exports = {
  requireAuthentication,
};
