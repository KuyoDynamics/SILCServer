const moment = require('moment');
let SILCGroup = require('../../models/silc/silc_group.model');
let SILCGroupMember = require('../../models/silc/silc_group_member.model');


//GET api/silcgroups
async  function getAllSILCGroups(req, res, next){
    console.log('Req.Query: ', req.query);
    try {
        const query = {

        }
        const silcgroups = await SILCGroup.find(req.query);
        return res.json(silcgroups)
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

// //GET api/silcgroups/:id
// exports.getSILCGroup = function(req, res){
//     SILCGroup.findById(req.params.id, function(err, silcGroup){
//         if(err) {
//             console.log(err);
//             return res.json(err);
//         }
//         else {
//             return res.json(silcGroup);
//         }

//     });
// };

// //PUT/PATCH api/silcGroup
// exports.updateSILCGroup = function(req, res){

//     var updateQuery = {
//         group_name: req.body.group_name || null,
//         group_url: req.body.group_url || null,
//         group_location: req.body.group_location || null,
//         group_formation_date: req.body.group_formation_date || null
//     };
   
//     var filteredQuery = {};
//     for(let x in updateQuery){
//         if(updateQuery[x] !== null){
//             filteredQuery[x]=updateQuery[x];
//         }
//     }

//     SILCGroup.findOneAndUpdate(req.params.id, filteredQuery, {new: true},
//         function(err, updatedSILCGroup){
//             if(err) return res.status(404).json(err);
//             return res.status(200).json(updatedSILCGroup);
//         }
//     );
// }

// //POST api/silcgroups
async function createSILCGroup(req, res, next){

    const silc_group = new SILCGroup({
            name: req.body.name,
            whatsapp_url: req.body.whatsapp_url,
            location: req.body.location,
            date_formed: req.body.date_formed,
            active: req.body.active,
            archived: req.body.archived,
            members: req.body.members
    });
    
    const session = await SILCGroup.startSession()    ;
    try {
        session.startTransaction();

        const ops = { session };

        await silc_group.validate();
        console.log('[silcserver] SILC group data fields for ', silc_group._id, ' successfully passed validation!');

        const result = await silc_group.save(ops);
        console.log('[silcserver] New SILC Group with id: ', silc_group._id, ' was successfully created!');

        await session.commitTransaction();
        session.endSession();

        res.status(201).send({
            message: "Record created successfully",
            record: result
        });
        return;

    } catch (error) {
        await session.abortTransaction();
        console.log('[silcserver] Transaction aborted!')

        session.endSession();
        console.log('[silcserver] Transaction ended!')
        
        res.status(422); //422 is Unprocessed Entity
        return next(error);
    }
}

// //DELETE api/silcgroups/:id
// exports.deleteSILCGroup = function(req, res){
//     SILCGroup.findByIdAndRemove(req.params.id, function(err, silcGroup){
//         if(err){
//             console.log(err);
//             return res.status(500).json({
//                 message: 'Error Occurred during delete operation',
//                 error: err,
//                 id: req.params.id                
//             });
//         }
//         else{
//             if (!silcGroup) return res.status(404).json({
//                 message: 'Record Not Found',
//                 id: req.params.id
//             })
//             else return res.status(200).json({
//                 message: 'Successfully deleted',
//                 id: silcGroup._id
//             });
//         }
//     });
// };

module.exports = {
    getAllSILCGroups,
    createSILCGroup  
}

