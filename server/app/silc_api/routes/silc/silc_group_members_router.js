let router = require('express').Router();
let controller = require('../../controllers/silc/silc_group_member.controller');

router.route('/')
//Get ALL SILC Group Members
	.get(controller.getAllSILCGroupMembers)
//Add New SILC Group Members
	.post(controller.createSILCGroupMember);
router.route('/:id')
	.get(controller.getSILCGroupMember)
//Update SILC Group Member Record
	.patch(controller.partialUpdateSILCGroupMember);
//Delete SILC Group Record Member
//.delete(controller.deleteSILCGroupMember)

module.exports = router;