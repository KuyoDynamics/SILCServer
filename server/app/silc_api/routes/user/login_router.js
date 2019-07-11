let router = require('express').Router();
let controller = require('../controllers/login.controller');
let {jwt_new_token_provider} = require('../../../helpers/authentication/jwt_new_token_provider');
router.route('/')
    .post(controller.login, jwt_new_token_provider);
module.exports = router;