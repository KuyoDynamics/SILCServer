let router = require("express").Router();
let controller = require("../../controllers/user_controllers/login_controller");
let {
  createNewJWTToken,
} = require("../../helpers/authentication/jwt_new_token_provider");
router.route("/").post(controller.login, createNewJWTToken);
module.exports = router;
