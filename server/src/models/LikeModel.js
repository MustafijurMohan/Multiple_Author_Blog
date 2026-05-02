const mongoose = require('mongoose')

const LikeSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'posts', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
}, { timestamps: true })
 
// One like per user per post
LikeSchema.index({ posts: 1, users: 1 }, { unique: true })
const LikeModel = mongoose.model('Like', LikeSchema)
module.exports = LikeModel