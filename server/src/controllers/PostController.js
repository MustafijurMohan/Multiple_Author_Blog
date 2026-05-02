const PostModel = require('../models/PostModel')
const cloudinary = require('cloudinary').v2
const fs = require('fs')


// Create post
exports.CreatePost = async (req, res, next) => {
    try {
        const userId = req.userID
        const { title, description } = req.body

        // Basic Validation
        if( !title || !description) {
            const err = new Error(`title and description are required`)
            err.status = 400
            return next(err)
        }

        // Upload Image
        let imageUrl = null
        const file = req.files && req.files.image ? req.files.image[0] : null
        if(file && file.path) {
            const result = await cloudinary.uploader.upload(file.path)
                imageUrl = result.secure_url
                // delete local file
                fs.unlinkSync(file.path)
        }
        

        // Create Post
        const newPost = await PostModel.create({user: userId, title, description, image: imageUrl})

        return res.status(201).json({success: true, message:"Post created successfully", data: newPost})
    } catch (error) {
        next(error)
    }
}

// Update post
exports.UpdatePost = async (req, res, next) => {
    try {
        const postId = req.params.id
        const userId = req.userID

        const post = await PostModel.findById(postId)

        // Check post Exits
        if(!post) {
            return res.status(404).json({success: false, message: "Post not found"})
        }

        // Ownership Check
        if(post.user.toString() !== userId.toString()) {
            return res.status(403).json({success: false, message: "You can update only your own post"})
        }

        // Whitelist fields (avoid updating unwanted fields)
        const updateData = {
            ...(req.body.title && { title: req.body.title }),
            ...(req.body.description && { description: req.body.description })
        }

        // Update Post
        const updatedPost = await PostModel.findByIdAndUpdate( postId, { $set: updateData }, { runValidators: true })

        return res.status(200).json({ success: true, message: "Post updated successfully", data: updatedPost })
    } catch (error) {
        next(error)
    }
}

// Single Post
exports.SignlePostByID = async (req, res, next) => {
    try {
        const id = req.params.id
        const Query = {_id: id}
        const data = await PostModel.findById(Query).populate('user', 'username')

        return res.status(200).json({success: true, data})
    } catch (error) {
        next(error)
    }
}
// Get All Post
exports.GetAllPost = async (req, res, next) => {
    try {
        const data = await PostModel.find().populate('user', 'username').sort({ createdAt: -1 })

        return res.status(200).json({success: true, data})
    } catch (error) {
        next(error)
    }
}

// Delete Post
exports.DeletePost = async (req, res, next) => {
    try {
        const postId = req.params.id
        const userId = req.userID

        const post = await PostModel.findById(postId)

        // Check post exists
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        // Ownership check
        if (post.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can delete only your own post"
            })
        }

        await PostModel.findByIdAndDelete(postId)

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        })

    } catch (error) {
        next(error)
    }
}

