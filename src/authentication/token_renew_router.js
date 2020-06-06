let controller = require('../../controllers/user_controllers/login_controller'); //Replace with token renew controller when done

let router = require('express').Router();

router.route('/')
    .get(controller.getNewToken);


module.exports = router;