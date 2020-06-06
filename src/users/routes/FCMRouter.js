let controller = require("../../controllers/user_controllers/login_controller"); //Replace with fcm controller when done
let router = require("express").Router();
let verifyAuthScope = require("../../helpers/authentication/jwt_auth_scope_verifier");

router.route("/:id").get(verifyAuthScope(["read:fcm"]), controller.getFcmToken);
router
  .route("/")
  .post(verifyAuthScope(["create:fcm"]), controller.registerNewFcmToken);

module.exports = router;
