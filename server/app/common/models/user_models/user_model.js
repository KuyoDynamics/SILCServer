let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

const {isValidDrivingLicense,isValidNationalID,isValidPassportID,silcGroupIdExists,identificationNotDuplicate,isValidEmail, ValidationMessages, userIdExists} = require('../helpers/model_validation_helpers');

let Schema = mongoose.Schema;
let UserTypeOptions = ['admin','read_only','group_admin','silc_member'];
let IDTypeOptions = ['national_id','passport_id','driving_license_id'];
let MembershipStatus=['active','inactive','deactivated'];
let SexTypeOptions = ['male','female','unknown'];

let SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2*60*60*1000; //max of 5 attempts resulting in a 2 hour lock
/**
 * User Schema
 */
let UserSchema = new Schema({
    first_name: { 
		type: String, 
		required: true, 
		minlength: 2, 
		trim: true,
		alias: 'fname' 
	},
	middle_name: { 
		type: String, 
		required: false, 
		trim: true,
		minlength: 2, 
		alias: 'mname' 
	},
	last_name: { 
		type: String, 
		required: true, 
		trim: true,
		minlength: 2, 
		alias: 'lname' 
	},    
	sex: { 
		type: String, 
		enum: SexTypeOptions, 
		lowercase: true,
		trim: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		trim: true,
		lowercase: true,
		validate: {
            validator: isValidEmail,
            message: ValidationMessages.invalidEmailMsg
        }
	},
	phone: {
		type: String,
		unique: true,
		trim: true,
		required: true
    },
    address: {
        street: String,
        city: String,
        district: String,
        province: String,
        country: String
    },
    identification: {
        type: [{
				id_type: {
					type: String,
					enum: IDTypeOptions,
					lowercase: true,
					required: true,
					unique: true
				},
				id_value: {
					type: String,
					required: true,
					validate: {
						validator: function(v) {
							switch(this.id_type.toString()){
							case 'national_id':
								return isValidNationalID(v);
							case 'passport_id':
								return isValidPassportID(v);
							case 'driving_license_id':
								return isValidDrivingLicense(v);
							default:
								return false;
							}
						},
						message: ValidationMessages.invalidNationalIDMsg
					}
				}
		}],
        required: true
    },
    membership: {
        type: [{
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
			status: {
				type: String,
				enum: MembershipStatus,
				required: true
			}
		}],
		required: false
    },
	user_roles: [{
        type: String,
		ref: 'UserRole',
		required: true,
		default: ['read_only']
	}],
	date_of_birth: {
		type: String,
		required: false
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}	,
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

/**
 * Hooks
 */
UserSchema.pre('save', function(next){
	let user = this;
    // only hash the password if it has been modified (or is new)
    if(!user.isModified('password')){
        return next();
    }
    //generate a salt and hash password
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) {
                return next(err);
            }
            user.password = hash;
            next();
        })
    });
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
module.exports = User;