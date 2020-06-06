let router = require("express").Router();
let controller = require("../controllers/UserController");
let verifyAuthScope = require("../../helpers/authentication/jwt_auth_scope_verifier");
let {
  requireAuthentication,
} = require("../../helpers/authentication/authentication_manager");

router
  .route("/:id")
  .get(
    requireAuthentication,
    verifyAuthScope(["read:users"]),
    controller.getUser
  );
router.route("/").post(controller.createUser); //User create should not be authenticated
//All other routes below should require authentication

module.exports = router;
