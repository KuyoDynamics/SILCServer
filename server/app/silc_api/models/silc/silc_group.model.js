const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SILCGroupSchema = new Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5, 
        maxlength: 50, 
        alias: 'Group Name' 
    },
    whatsapp_url: { 
        type: String, 
        required: true, 
        alias: 'Group URL' 
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
    members: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'SILCGroupMember' 
    }]
    
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