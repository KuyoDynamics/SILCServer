let router = require("express").Router();
let controller = require("../../controllers/user_controllers/user_controller");
let verify_auth_scope = require("../../helpers/authentication/jwt_auth_scope_verifier");
let {
  require_authentication,
} = require("../../helpers/authentication/authentication_manager");

router
  .route("/:id")
  .get(
    require_authentication,
    verify_auth_scope(["read:users"]),
    controller.getUser
  );
router.route("/").post(controller.createUser); //User create should not be authenticated
//All other routes below should require authentication

module.exports = router;
