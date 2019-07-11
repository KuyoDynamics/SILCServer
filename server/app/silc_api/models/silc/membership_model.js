const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {silcGroupIdExists, userIdExists, ValidationMessages} = require('../model_validation_helpers');

let MembershipStatus=['active','inactive','deactivated'];

let MembershipSchema = new Schema({
	group_id: {
		type: Schema.Types.ObjectId,
		ref: 'SILCGroup',
		required: true,
		validate: {
			isAsync: true,
			validator: silcGroupIdExists,
			message: ValidationMessages.invalidGroupIDMsg
		}
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		validate: {
			isAsync: true,
			validator: userIdExists,
			message: ValidationMessages.invalidUserIdMsg
		}
	},
	status: {
		type: String,
		enum: MembershipStatus,
		required: true
	}
}, {timestamps: true, autoIndex: false});

MembershipSchema.post('updateMany', function(next){
	// let query = this.getQuery()._id.$in;
	// if(query.length !== this.commandResult.result.nModified) {
	// 	return next( new Error('not all group ids were matched and updated: Group ids(' + query +')'));
	// }
	// else {
	// 	return next();
	// }
	next();
});

let Membership = mongoose.model('Membership', MembershipSchema);

module.exports = Membership;