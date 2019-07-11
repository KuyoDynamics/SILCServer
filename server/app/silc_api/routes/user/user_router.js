let router = require('express').Router();
let controller = require('../controllers/user.controller');
let verify_auth_scope = require('../../../helpers/authentication/jwt_auth_scope_verifier');

router.route('/:id')
    .get(verify_auth_scope(['read:users']), controller.getUser)
router.route('/')
    .post(verify_auth_scope(['create:users']), controller.createUser)

module.exports = router;    
