let router = require('express').Router();


module.exports = function(){
    router.route('/')
    .get(function(req,res){
        
        return res.send('Admin Homepage');
    })
}
