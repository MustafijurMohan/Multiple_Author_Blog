const CommentModel = require('../models/CommentModel')
const PostModel    = require('../models/PostModel')
const UserModel = require('../models/UserModel')



// POST /api/posts/comments/:postId  →  Add a comment
exports.AddComment = async (req, res, next) => {
    try {
        const postId = req.params.postId
        const userId = req.userID
        const { content } = req.body
 
        if (!content || !content.trim()) {
            const err = new Error('Comment content is required.')
            err.status = 400
            return next(err)
        }
 
        // Check post exists
        const post = await PostModel.findById(postId)
        if (!post) {
            const err = new Error('Post not found.')
            err.status = 404
            return next(err)
        }
 
        const comment = await CommentModel.create({
            post:    postId,
            user:    userId,
            content: content.trim(),
        })
 
        // Populate user info before returning
        await comment.populate('users', 'username image')
 
        return res.status(201).json({
            success: true,
            message: 'Comment added successfully.',
            data: comment,
        })
    } catch (error) {
        next(error)
    }
}
 
// GET /api/posts/comments/:postId  →  Get all comments for a post
exports.GetComments = async (req, res, next) => {
    try {
        const postId = req.params.postId
 
        const comments = await CommentModel
            .find({ post: postId })
            .populate('user', 'username image')
            .sort({ createdAt: -1 })
 
        return res.status(200).json({
            success: true,
            count: comments.length,
            data: comments,
        })
    } catch (error) {
        next(error)
    }
}
 
// DELETE /api/posts/comments/delete/:commentId  →  Delete own comment
exports.DeleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId
        const userId    = req.userID
 
        const comment = await CommentModel.findById(commentId)
        if (!comment) {
            const err = new Error('Comment not found.')
            err.status = 404
            return next(err)
        }
 
        // Only the comment author can delete it
        if (comment.user.toString() !== userId.toString()) {
            const err = new Error('You can only delete your own comments.')
            err.status = 403
            return next(err)
        }
 
        await CommentModel.findByIdAndDelete(commentId)
 
        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully.',
        })
    } catch (error) {
        next(error)
    }
}
 