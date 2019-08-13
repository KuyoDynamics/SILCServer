let Schema = require('mongoose').Schema;
let mongoose = require('mongoose');

let UserRoleSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    permissions:[{
        type: String,
		ref: 'UserRolePermission',
		required: true,
		default: ['read:users']
	}],
}, {timestamps: true});

let UserRoleModel = mongoose.model('UserRole', UserRoleSchema);
module.exports = UserRoleModel;