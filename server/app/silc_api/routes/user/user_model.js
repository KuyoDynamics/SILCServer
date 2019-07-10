let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let SALT_WORK_FACTOR = 10;
//max of 5 attempts resulting in a 2 hour lock
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2*60*60*1000;

let Schema = mongoose.Schema;
let UserTypeOptions = ['field_agent','system_admin','report_viewer'];
let SexTypeOptions = ['male','female','unknown'];

let UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: {unique: true}
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
	sex: { 
		type: String, 
		enum: SexTypeOptions, 
		lowercase: true,
		trim: true,
		required: true
    },
    date_of_birth: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        enum: UserTypeOptions
    },
    user_permissions: [{
        type: String,
        required: true
    }],
    login_attempts: {
        type: Number,
        required: true,
        default: 0
    } ,
    lock_until: {
        type: Number
    },
    fcm_tokens: [{
        type: String,
        unique: true
    }]
}, {timestamps: true});

//Pre Save Hook
UserSchema.pre('save', function(next) {
    let user = this;
    // only hash the password if it has been modified (or is new)
    if(!user.isModified('password')){
        return next();
    }
    //generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) {
            return next(err);
        }
        //hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) {
                return next(err);
            }
            // Override the cleartext password with the hashed one
            user.password = hash;
            next();
        })
    })
});

UserSchema.post('findOne', function(doc, next){
    try {
        let fcm_tokens = doc.fcm_tokens;
        fcm_tokens.forEach((token, index)=>{
            doc.fcm_tokens[index] = text_encryption.decryptText(token);
        });
        next();        
    } catch (error) {
        console.log('Error Decrypting token: ', error);
        next(error);    
    }
});

UserSchema.post('find', function(doc, next){
    try {
        let fcm_tokens = doc.fcm_tokens;
        fcm_tokens.forEach((token, index)=>{
            doc.fcm_tokens[index] = text_encryption.decryptText(token);
        });
        next();        
    } catch (error) {
        console.log('Error Decrypting token: ', error);
        next(error);    
    }
});

//Add Password Verification Middleware
UserSchema.methods.comparePassword =  function(candidatePassword, userPassword){
    return new Promise(function(resolve, reject){
        bcrypt.compare(candidatePassword, userPassword, function(err, isMatch){
            if(err){
                return reject(err);
            }
            return resolve(isMatch);
        });
    });    
};

//increment login attempts
UserSchema.methods.incLoginAttempts = function(callback){
    //if we have a previous lock that has expired, restart at 1
    if(this.lock_until && this.lock_until < Date.now()){
        return this.updateOne({
            $set: { login_attempts: 1},
            $unset: { lock_until: 1}
        }, callback);
    }
    //otherwise we're incrementing
    let updates =  {$inc: {login_attempts: 1}};
    //lock the account if we've reached max attempts and its not locked already
    if(this.login_attempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked){
        updates.$set = { lock_until: Date.now() + LOCK_TIME};
    }
    return this.updateOne(updates, callback);
};
//expose enum on the model
UserSchema.statics.failedLoginReasons = {
    NOT_FOUND: 'user not found',
    PASSWORD_INCORRECT: 'incorrect password',
    MAX_ATTEMPTS: 'maximum login attempts reached'
}
//Virtuals
UserSchema.virtual('isLocked').get(function(){
    //check for a future lockUntil timestamp
    return !!(this.lock_until && this.lock_until > Date.now());
});

let User = mongoose.model('User', UserSchema);

User.init(function(User){
    mongoose.connection.createCollection('users');
})
module.exports = User;