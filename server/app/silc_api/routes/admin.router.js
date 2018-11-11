let router = require('express').Router();


router.route('/')
    .get(function(req,res){
        
        res.send('Admin Homepage');
    })
module.exports = router;