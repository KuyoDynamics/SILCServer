let controller = require('../controllers/token_renew.controller');

let router = require('express').Router();

router.route('/')
    .get(controller.getNewToken);


module.exports = router;