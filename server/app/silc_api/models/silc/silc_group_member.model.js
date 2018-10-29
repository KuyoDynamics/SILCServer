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
    name: {
        first_name: { 
            type: String, 
            required: true, 
            minlength: 2, 
            trim: true,
            alias: "First Name" 
        },
        middle_name: { 
            type: String, 
            required: false, 
            trim: true,
            minlength: 2, 
            alias: "Middle Name" 
        },
        last_name: { 
            type: String, 
            required: true, 
            trim: true,
            minlength: 2, 
            alias: "Last Name" 
        }
    },    
    sex: { 
        type: String, 
        enum: ['male','female','unknown'], 
        lowercase: true,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i
    },
    phone: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    national_id: {
        type: {
            id_type: {
                type: String,
                 enum: ['national_id','passport_id', 'driving_license']
            },
            id_value: {
                type: String,
                validate: {
                    validator: function(v, callback) {
                        //conditionally run validation based on type of id passed 
                        return false;
                    }
                }
            }
        },
        unique: true,
        trim: true,
        required: false
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

//Post updateMany hook
SILCGroupMemberSchema.post('updateMany', function(){
    let query = this.getQuery()._id.$in;
    if(query.length !== commandResult.result.nModified) {
        return next( new Error('not all group ids were matched and updated: Group ids(' + query +')'));
    }
    else {
        console.log('Passed In hook...')
        return next();
    }
});

//Create model
let SILCGroupMember = mongoose.model('SILCGroupMember', SILCGroupMemberSchema);

module.exports = SILCGroupMember;