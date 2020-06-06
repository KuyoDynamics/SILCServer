let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let baseBatchTransactionSchema = new Schema({
    amount: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 256,
        alias: 'Principal Transaction Amount'
    },
    currency: {
        type: Number
    },
    type: {
        type: String,
        required: true
    }
})