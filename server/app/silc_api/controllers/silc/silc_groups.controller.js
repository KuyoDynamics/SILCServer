const moment = require('moment');
let mongoose = require('mongoose');
let SILCGroup = require('../../models/silc/silc_group.model');


//GET api/silcgroups
exports.getAllSILCGroups = function(req, res){
    SILCGroup.find(req.query, function(err, silcgroups){
        if(err) {
            console.log(err);
            return res.json(err);
        }
        else  return res.json(silcgroups);
    });
};

//GET api/silcgroups/:id
exports.getSILCGroup = function(req, res){
    SILCGroup.findById(req.params.id, function(err, silcGroup){
        if(err) {
            console.log(err);
            return res.json(err);
        }
        else {
            return res.json(silcGroup);
        }

    });
};

//PUT/PATCH api/silcGroup
exports.updateSILCGroup = function(req, res){

    var updateQuery = {
        group_name: req.body.group_name || null,
        group_url: req.body.group_url || null,
        group_location: req.body.group_location || null,
        group_formation_date: req.body.group_formation_date || null
    };
   
    var filteredQuery = {};
    for(let x in updateQuery){
        if(updateQuery[x] !== null){
            filteredQuery[x]=updateQuery[x];
        }
    }

    SILCGroup.findOneAndUpdate(req.params.id, filteredQuery, {new: true},
        function(err, updatedSILCGroup){
            if(err) return res.status(404).json(err);
            return res.status(200).json(updatedSILCGroup);
        }
    );
}

//POST api/silcgroups
exports.createSILCGroup = function(req, res){
    //Create SILC Group
    const silc_group = new SILCGroup({
            name: req.body.name,
            whatsapp_url: req.body.whatsapp_url,
            location: req.body.location,
            date_formed: req.body.date_formed,
            active: req.body.active,
            members: req.body.members
        });
   
    //Save Group
    silc_group.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while creating a SILC Group!"
        });
    });

}

//DELETE api/silcgroups/:id
exports.deleteSILCGroup = function(req, res){
    SILCGroup.findByIdAndRemove(req.params.id, function(err, silcGroup){
        if(err){
            console.log(err);
            return res.status(500).json({
                message: 'Error Occurred during delete operation',
                error: err,
                id: req.params.id                
            });
        }
        else{
            if (!silcGroup) return res.status(404).json({
                message: 'Record Not Found',
                id: req.params.id
            })
            else return res.status(200).json({
                message: 'Successfully deleted',
                id: silcGroup._id
            });
        }
    });
};

