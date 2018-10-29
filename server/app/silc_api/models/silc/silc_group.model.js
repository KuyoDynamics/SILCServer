const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SILCGroupSchema = new Schema({
    name: { 
        type: String, 
        required: true,
        unique: true,
        minlength: 5, 
        maxlength: 50, 
        alias: 'Group Name',
        validate: {
            validator: function(v){
                return /^((?!silc)(?!group).)*$/i.test(v)
            },
            message: 'Words such as SILC and Group are not allowed to be part of a SILC Group name'
        } 
    },
    whatsapp_url: { 
        type: String, 
        required: true, 
        alias: 'Group URL',
        unique: true
    },
    location: { 
        type: String, 
        required: true, 
        alias: 'Group Location' 
    },
    date_formed: { 
        type: String, 
        required: true, 
        alias: 'Group Formation Date' 
    },
    active: { 
        type: Boolean, 
        required: true, 
        alias: 'Active' 
    },
    archived: {
        type: Boolean,
        alias: 'Archived'
    },
    members: {
        type:
            [{ 
            type: Schema.Types.ObjectId, 
            ref: 'SILCGroupMember',
            required: true 
            }],
        required: true,
          "active":true,
        validate: {
            validator: function(v) {
                return v.length <= 0;
            },
            message: "a members field must be empty when new group is created"
        }
    }    
}, {timestamps: true});

//pre updateMany hook
SILCGroupSchema.pre('updateMany', function(next){
    // let query = this.getQuery()._id.$in;
    // if(!query.length){
    //     return next(new Error('group ids is empty: a member must belong atleast to one silc group'));
    // }
    // else
    //     return next();
    return next();
})
//post updateMany hook
SILCGroupSchema.post('updateMany', function(commandResult, next){
    let query = this.getQuery()._id.$in;
    if(query.length !== commandResult.result.nModified) {
        return next( new Error('not all group ids were matched and updated: Group ids(' + query +')'));
    }
    else {
        console.log('Passed In hook...')
        return next();
    }
});

//pre find hook
SILCGroupSchema.pre('find', function(){
   // this.populate('members')
});

//pre update hook
SILCGroupSchema.pre('findOneAndUpdate',  function(){

});

//post update hook
SILCGroupSchema.post('findOneAndUpdate', function(){

});

//Create modelS
let SILCGroup = mongoose.model('SILCGroup', SILCGroupSchema);

module.exports = SILCGroup;