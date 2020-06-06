let controller = require("../../controllers/user_controllers/login_controller"); //Replace with fcm controller when done
let router = require("express").Router();
let verify_auth_scope = require("../helpers/authentication/jwt_auth_scope_verifier");

router
  .route("/:id")
  .get(verify_auth_scope(["read:fcm"]), controller.getFcmToken);
router
  .route("/")
  .post(verify_auth_scope(["create:fcm"]), controller.registerNewFcmToken);

module.exports = router;
