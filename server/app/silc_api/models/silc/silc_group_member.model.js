const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SILCGroup = require('./silc_group.model');

let SILCGroupMemberSchema = new Schema({
    silc_groups: {
        type: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'SILCGroup', 
            required: true,
            validate: {
                isAsync: true,
                validator: function(v, callback){
                    
                    return SILCGroup.findById(v, function(err, silc_group){
                            if(err){
                                return callback(false, err);
                            }
                            if(silc_group){
                                console.log('Group: ', silc_group);
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                },
                message: "silc_groups field values must be valid existing group ids"
            }}],
        validate: {
            validator: function(v) {
                console.log("V is : ", v);
                return v.length > 0;
            },
            message: "a member must belong to atleast one valid SILC Group. silc_groups cannot be empty"
        }
    },
    first_name: { 
        type: String, 
        required: true, 
        minlength: 2, 
        alias: "First Name" 
    },
    middle_name: { 
        type: String, 
        required: false, 
        minlength: 2, 
        alias: "Middle Name" 
    },
    last_name: { 
        type: String, 
        required: true, 
        minlength: 2, 
        alias: "Last Name" 
    },
    sex: { 
        type: String, 
        enum: ['male','female','unknown'], 
        required: true
    }
}, {timestamps: true});

//Pre save hook
SILCGroupMemberSchema.pre('save', function(){
    
});

//Pre find hook
SILCGroupMemberSchema.pre('find', function(){
    //this.populate('silc_group')
});

//Pre update hook
SILCGroupMemberSchema.pre('findOneAndUpdate',  function(){

});

//Post update hook
SILCGroupMemberSchema.post('findOneAndUpdate', function(){

});

//Create model
let SILCGroupMember = mongoose.model('SILCGroupMember', SILCGroupMemberSchema);

module.exports = SILCGroupMember;