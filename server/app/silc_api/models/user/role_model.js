let Schema = require('mongoose').Schema;
let mongoose = require('mongoose');

let RoleSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    permissions: [
        {
            name:{
                type: String,
                unique: true,
                required: true
            },
            description: {
                type: String,
                required: false
            }
        }
    ]

}, {timestamps: true});

let RoleModel = mongoose.model('Role', RoleSchema);
module.exports = RoleModel;