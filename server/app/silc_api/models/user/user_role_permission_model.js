let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PermissionSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    }
}, {timestamps: true});

let PermissionModel = mongoose.model('UserRolePermission', PermissionSchema);
module.exports = PermissionModel;