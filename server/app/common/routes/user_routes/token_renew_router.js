let controller = require('../../controllers/user/login_controller'); //Replace with token renew controller when done

let router = require('express').Router();

router.route('/')
    .get(controller.getNewToken);


module.exports = router;