const LikeModel  = require('../models/LikeModel')
const PostModel = require('../models/PostModel')
 
// POST /api/posts/like/:postId  →  Toggle like (like if not liked, unlike if already liked)
exports.ToggleLike = async (req, res, next) => {
    try {
        const postId = req.params.postId
        const userId = req.userID
 
        // Check post exists
        const post = await PostModel.findById(postId)
        if (!post) {
            const err = new Error('Post not found.')
            err.status = 404
            return next(err)
        }
 
        // Check if already liked
        const existing = await LikeModel.findOne({ post: postId, user: userId })
 
        if (existing) {
            // Unlike
            await LikeModel.findByIdAndDelete(existing._id)
            const count = await LikeModel.countDocuments({ post: postId })
            return res.status(200).json({
                success: true,
                message: 'Post unliked.',
                liked: false,
                likeCount: count,
            })
        } else {
            // Like
            await LikeModel.create({ post: postId, user: userId })
            const count = await LikeModel.countDocuments({ post: postId })
            return res.status(201).json({
                success: true,
                message: 'Post liked.',
                liked: true,
                likeCount: count,
            })
        }
    } catch (error) {
        next(error)
    }
}
 
// GET /api/posts/likes/:postId  →  Get like count + whether current user liked it
exports.GetLikes = async (req, res, next) => {
    try {
        const postId = req.params.postId
        const userId = req.userID  // may be undefined if not authenticated
 
        const likeCount = await LikeModel.countDocuments({ post: postId })
        const liked     = userId
            ? !!(await LikeModel.findOne({ post: postId, user: userId }))
            : false
 
        return res.status(200).json({
            success: true,
            likeCount,
            liked,
        })
    } catch (error) {
        next(error)
    }
}
 