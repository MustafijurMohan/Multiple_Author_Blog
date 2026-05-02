const mongoose = require('mongoose')
 
const CommentSchema = new mongoose.Schema({
    post:    { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
}, { timestamps: true })

const CommentModel = mongoose.model('Comment', CommentSchema)
module.exports = CommentModel
 