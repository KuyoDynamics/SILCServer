let SILCGroupMember = require('../../models/silc/silc_group_member.model');
let SILCGroup = require('../../models/silc/silc_group.model');

//POST api/silcgroup_members
async function createSILCGroupMember(req, res, next){

    const silc_group_member = new SILCGroupMember({
        silc_groups: req.body.silc_groups,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        middle_name: req.body.middle_name,
        sex: req.body.sex,
        phone: req.body.phone,
        email: req.body.email,
        identification: req.body.identification
    });

    const session = await SILCGroupMember.startSession();

    try {
        session.startTransaction();

        const ops = { session };

        await silc_group_member.validate();
        console.log('[silcserver] SILC Group Member data fields for ', silc_group_member._id, ' successfully passed validation!');

        await SILCGroup.updateMany({ _id: { $in: silc_group_member.silc_groups }},{ $addToSet: { members: silc_group_member._id }}, ops);
        console.log('[silcserver] SILC Groups for ', silc_group_member._id, ' were successfully updated!');

        const result = await silc_group_member.save(ops);
        console.log('[silcserver] New SILC Group Member with id: ', silc_group_member._id, ' was successfully created!');

        await session.commitTransaction();
        session.endSession();

        res.status(201).send({
            message: "Record created successfully",
            record: result
        })
        return;
    } catch (error) {
        await session.abortTransaction();
        console.log('[silcserver] Transaction aborted!')

        session.endSession();
        console.log('[silcserver] Transaction ended!')
        
        res.status(422); //422 is Unprocessed Entity
        return next(error);
    }
};

//PATCH api/silc_group_members/:id
async function partialUpdateSILCGroupMember(req, res, next){
    console.log("Params: ", req.params);
    console.log("Body: ", req.body);

    if(Object.keys(req.body).length === 0){
        res.status(422);
        return next(new Error('Cannot process empty request body'));
    }

    const session = await SILCGroupMember.startSession();

    try {
        session.startTransaction();

        const ops = { session, new:true, runValidators: true, context: 'query' };
        const result = await SILCGroupMember.findOneAndUpdate({_id: req.params.id}, req.body, ops);
        if(!result){
            throw new Error('SILC Group Member record could not be found: ' + req.params.id);
        }
        await session.commitTransaction();
        session.endSession();

        res.status(200).send({
            message: "Record created successfully",
            record: result
        })
        return;
    } catch (error) {
        await session.abortTransaction();
        console.log('[silcserver] Update SILC Group Member Transaction aborted!')

        session.endSession();
        console.log('[silcserver] Update SILC Group Member Transaction ended!')
        
        res.status(422); //422 is Unprocessed Entity
        return next(error);
    }
}

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

// function formatDate(date_string){
//     date_string = Date(date_string);
//     return date_string;
// }


// // Async Await Examples
// async function endpointHandler(req, res){
//     try{
//         var user = await user.findById(req.userId);
//         var tasks = await tasks.findById(user.taskid);
//         tasks.completed = true;
//         await tasks.save();
//         res.send("Tasks completed");
//     } catch(error){
//         res.send(error);
//     }
// }
module.exports = {
    createSILCGroupMember,
    partialUpdateSILCGroupMember
}