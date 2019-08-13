let router = require('express').Router();
let controller = require('../../controllers/user_controllers/user_role_permission_controller');
let verify_auth_scope = require('../../../../helpers/authentication/jwt_auth_scope_verifier');
let {require_authentication} = require('../../../../helpers/authentication/authentication_manager');

router.route('/:id')
    .get(require_authentication,verify_auth_scope(['read:user_roles']), controller.getUserRolePermission)
router.route('/')
    .post(require_authentication,verify_auth_scope(['create:user_roles']), controller.createUserRolePermission)

module.exports = router;