const express = require('express')
const { registerUser, loginUser, findUserById, updateProfile, UserEamilVerify, UserOtpVerify, UserResetPassword } = require('../controllers/UserController')
const { authVerifyMiddleware } = require('../middlewares/authVerifyMiddleware')
const uploadImage = require('../middlewares/multer')
const { CreatePost, GetAllPost, SignlePostByID, UpdatePost, DeletePost } = require('../controllers/PostController')
const { AddComment, GetComments, DeleteComment } = require('../controllers/CommentController')
const { ToggleLike, GetLikes } = require('../controllers/LikeController')

const router = express.Router()


// User api
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/single-user', authVerifyMiddleware, findUserById)
router.post('/update-profile', authVerifyMiddleware, uploadImage, updateProfile)

// Forgot password api
router.post('/verifyEamil/:email', UserEamilVerify)
router.post('/verifyOtp', UserOtpVerify)
router.post('/resetPassword', UserResetPassword)


// Blog Post api
router.post('/create-post', authVerifyMiddleware, uploadImage, CreatePost)
router.post('/UpdatePost/:id', authVerifyMiddleware, UpdatePost)
router.get('/SignlePost/:id', SignlePostByID)
router.get('/AllPost', GetAllPost)
router.delete('/DeletePost/:id', authVerifyMiddleware, DeletePost)



// Comment routes
router.post('/comments/:postId', authVerifyMiddleware, AddComment)
router.get('/comments/:postId', GetComments)
router.delete('/comments/delete/:commentId', authVerifyMiddleware, DeleteComment)

// Like routes
router.post('/like/:postId', authVerifyMiddleware, ToggleLike)
router.get('/likes/:postId', GetLikes)               // no auth needed for count



module.exports = router