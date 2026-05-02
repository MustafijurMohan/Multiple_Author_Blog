const mongoose = require('mongoose')

const DataSchema = mongoose.Schema({
    email: {type: String, unique: true, trim: true, lowercase: true, required: true},
    otp: {type: Number},
    status: {type: Number, default: 0}
}, {versionKey: false, timestamps: true})

const OTPModel = mongoose.model('otps', DataSchema)
module.exports = OTPModel



