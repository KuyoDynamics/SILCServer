const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SILCGroup = require('./silc_group.model');

let IdentificationIDSchema = new Schema({
    id_type: {
        type: String,
         enum: ['national_id','passport_id', 'driving_license'],
         lowercase: true,
         required: true
    },
    id_value: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                switch(this.id_type.toString()){
                    case 'national_id':
                        return isValidNationalID(v);
                    case "passport_id":
                        return isValidPassportID(v);
                    case "driving_license":
                        return isValidDrivingLicense(v);
                    default:
                        return false;
                }
            },
            message: "Invalid Identification number"
        }
        // ,
        // validate: {
        //     isAsync: true,
        //     validator: isIdentificationIdDuplicate,
        //     message: "silc_group_member with the same id number already exists"
        // }
    }
})

let SILCGroupMemberSchema = new Schema({
    silc_groups: {
        type: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'SILCGroup', 
            required: true,
            validate: {
                isAsync: true,
                validator: silcGroupIdExists,
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
    identification_id: {
        type: IdentificationIDSchema,
        required: true
    }
}, {timestamps: true});

function silcGroupIdExists(v, callback){
                    
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
}

function isIdentificationIdDuplicate(v, type){
    return SILCGroupMember.findOne({"identification_id.id_value": v,"identification_id.id_type": type}, function(err, silc_group_member){
        if(err){
            return callback(false, err);
        }
        if(!silc_group_member){
            console.log('silc_group_member: ', silc_group_member);
            return true;
        }
        else {
            return false;
        }
    });
}

function isValidNationalID(national_id){
    return /^[0-9]{6}\/[0-9]{2}\/[1,2]{1}$/i.test(national_id);
}

function isValidPassportID(passport_id){
    return /^ZN(\d)(?!0\1+$)\d{5}$/i.test(passport_id);
}

function isValidDrivingLicense(driving_license){
    return /(\d)(?!0\1+$)\d{5}$/i.test(driving_license);
}

//Pre save hook
SILCGroupMemberSchema.pre('save', function(){
    
    let dup = isIdentificationIdDuplicate(this.identification_id.id_value, this.identification_id.id_type);

    if(dup){
        return next(new Error("a member with the same id already exists."));
    }
    return next();
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