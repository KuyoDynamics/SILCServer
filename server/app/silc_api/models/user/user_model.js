let mongoose = require('mongoose');
const {isValidEmail,isValidDrivingLicense,identificationNotDuplicate,isValidNationalID,isValidPassportID,ValidationMessages} = require('../model_validation_helpers');

let Schema = mongoose.Schema;
let UserTypeOptions = ['admin','read_only','group_admin','silc_member'];
let IDTypeOptions = ['national_id','passport_id','driving_license_id'];
let MembershipStatus=['active','inactive','deactivated'];
let SexTypeOptions = ['male','female','unknown'];
const {silcGroupIdExists, userIdExists, ValidationMessages} = require('../model_validation_helpers');
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
	user_type: {
        type: String,
		enum: UserTypeOptions,
		required: true
    }
});

/**
 * Hooks
 */
UserSchema.pre('save', function(next){
  	next();
});

let User = mongoose.model('User', UserSchema);

module.exports = User;