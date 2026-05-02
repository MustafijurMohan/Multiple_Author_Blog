require('dotenv').config({quiet: true})
const UserModel = require("../models/UserModel")
const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY


exports.authVerifyMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['token']
        if(!token) {
            return res.status(401).json({success: false, message: 'Unauthorized User !!'})
        } 

        const isVerified = jwt.verify(token, secretKey)

        const userData = await UserModel.findOne({email: isVerified.email}).select({password: 0})
        // console.log(userData)

        req.user = userData
        req.token = token
        req.userID = userData._id

        next()
        
    } catch (error) {
        return res.status(401).json({success: false, message: 'Invalid or expired token.'})
    }
}
