let mongoose=require('mongoose');
let schema = mongoose.Schema;
let text_encryption = require('../../../helpers/authentication/text_encryption');

let FCMTokenSchema = new schema({
    token: {
        type: String,
        unique: true,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    }
},{timestamps: true});

FCMTokenSchema.pre('save', function(next){
    var  fcm_token = this;
    if(!fcm_token.isModified){
        return next('token');
    }
    try {
        fcm_token.token = text_encryption.encryptText(fcm_token.token);
        next();
    } catch (error) {
        console.log('Error encrypting token: ', error);
        next(error);        
    }
});

FCMTokenSchema.post('findOne', function(doc, next){
    try {
        doc.token = text_encryption.decryptText(doc.token);
        next();        
    } catch (error) {
        console.log('Error Decrypting token: ', error);
        next(error);    
    }
});

let FcmToken = mongoose.model("FcmToken", FCMTokenSchema);

module.exports = FcmToken;