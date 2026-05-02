const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Username is required!']
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: [true, 'Email is required!'],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
    },
    image: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    
}, {versionKey: false, timestamps: true})

const UserModel = mongoose.model('users', UserSchema)
module.exports = UserModel
