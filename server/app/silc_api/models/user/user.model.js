let mongoose = require('mongoose');
const {isValidEmail,isValidDrivingLicense,identificationNotDuplicate,isValidNationalID,isValidPassportID,silcGroupIdExists, ValidationMessages} = require('../../models/model.validation.helpers');

let Schema = mongoose.Schema;
let UserTypeOptions = ['admin','read_only','group_admin'];
let IDTypeOptions = ['national_id','passport_id','driving_license_id'];
let SexTypeOptions = ['male','female','unknown'];
/**
 * User Schema
 */
let UserSchema = new Schema({
    first_name: { 
		type: String, 
		required: true, 
		minlength: 2, 
		trim: true,
		alias: 'First Name' 
	},
	middle_name: { 
		type: String, 
		required: false, 
		trim: true,
		minlength: 2, 
		alias: 'Middle Name' 
	},
	last_name: { 
		type: String, 
		required: true, 
		trim: true,
		minlength: 2, 
		alias: 'Last Name' 
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
        type: IdentificationSchema,
        required: true
    },
    membership: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Membership',
            required: false,
            validate: {
                isAsync: true,
                validator: silcGroupIdExists,
                message: 'silc_groups field values must be valid existing group ids'
            }
        }]
    },
	user_type: {
        type: String,
        enum: UserTypeOptions
    }
});

/**
 * User Identification Schema
 */
let IdentificationSchema = new Schema({
	id_type: {
		type: String,
		enum: IDTypeOptions,
		lowercase: true,
		required: true
	},
	id_value: {
		type: String,
		required: true,
		validate: {
			validator: identificationNotDuplicate,
			message: ValidationMessages.duplicateIdentification
        },
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
			message: 'Invalid Identification number'
		}
	}
});

let User = mongoose.model('User', UserSchema);

module.exports = User;

