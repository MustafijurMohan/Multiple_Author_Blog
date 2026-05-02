require('dotenv').config({quiet: true})
const UserModel = require("../models/UserModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const OTPModel = require('../models/OTPModel')
const EmailSend = require('../utility/EmailHelper')
const secretKey = process.env.SECRET_KEY
const cloudinary = require('cloudinary').v2
const fs = require('fs')



// Register User
exports.registerUser = async (req, res, next) => {
    try {
        const {username, email, password} = req.body

          // 1. Basic validation checks
            if(!username || !email || !password) {
                const err = new Error(`All fields are required!`)
                err.status = 400
                return next(err)
            }

          // 2. Email format check (simple regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)) {
                const err = new Error(`Invalid eamil format!`)
                err.status = 400
                return next(err)
            }

          // 3. Password length check
            if(password.length < 6) {
                const err = new Error(`Password must be at least 6 characters long!`)
                err.status = 400
                return next(err)
            }

          // 4. Check if user already exists
            const userExits = await UserModel.findOne({email}) 
            if(userExits) {
                const err = new Error(`User already exits with this email.`)
                err.status = 400
                return next(err)
            }

          // 5.Password hash and salt
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

          // 6. Crate Data in database
            const user = await UserModel.create({username, email, password: hashedPassword})

          // 7. Generate Token 
            const token = jwt.sign({
                userId: user._id,
                name: user.username,
                email: user.email
            }, secretKey, {expiresIn: '7d'})

            const userResponse = {
                _id: user._id,
                name: user.username,
                email: user.email,
                image: user.image,
                country: user.country,
                createdAt: user.createdAt
            }

          // 8. Return response
            return res.status(201).json({success: true, message: 'User Register Succefull', data: userResponse, token})
    } catch (error) {
        next(error)
    }
}

// Login User
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password} = req.body

          // 1. Basic validation checks
            if( !email || !password) {
                const err = new Error(`All fields are required!`)
                err.status = 400
                return next(err)
            }

          // 2. Email format check (simple regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)) {
                const err = new Error(`Invalid eamil format!`)
                err.status = 400
                return next(err)
            }

          // 3. Check if user exists
            const user = await UserModel.findOne({email}) 
            if(!user) {
                const err = new Error(`Invalid email or password.`)
                err.status = 401
                return next(err)
            }

          // 4.Check password match
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) {
                const err = new Error(`Invalid email or password.`)
                err.status = 401
                return next(err)
            }

          // 5. Generate Token 
            const token = jwt.sign({
                userId: user._id,
                name: user.username,
                email: user.email
            }, secretKey, {expiresIn: '7d'})

            const userResponse = {
                _id: user._id,
                name: user.username,
                email: user.email,
                image: user.image,
                country: user.country,
                createdAt: user.createdAt
            }

          // 6. Return response
            return res.status(201).json({success: true, message: 'User Login Succefull', data: userResponse, token})
    } catch (error) {
        next(error)
    }
}

// Find user by id
exports.findUserById = async (req, res, next) => {
    try {
        const id = req.userID

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const user = await UserModel.findById(id).select({password: 0})

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: user
        })

    } catch (error) {
        next(error)
    }
}

// Update User Profile
exports.updateProfile = async (req, res, next) => {
    try {
        const id = req.userID
        
        const {username, email, country} = req.body

        // Email validation (only if provided)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(email && !emailRegex.test(email)) {
                const err = new Error(`Invalid eamil format!`)
                err.status = 400
                return next(err)
            }

         // Handle Cloudinary Image Upload (if file exists)
            // let imageUrl   
            // if(req.files) {
            //     const result = await cloudinary.uploader.upload(req.files.path)
            //     imageUrl = result.secure_url
            // }
        // Upload Image
                let imageUrl = null
                const file = req.files && req.files.image ? req.files.image[0] : null
                if(file && file.path) {
                    const result = await cloudinary.uploader.upload(file.path)
                        imageUrl = result.secure_url
                        // delete local file
                        fs.unlinkSync(file.path)
                }

        // Build update data (only include provided fields)
        const updateData = {
            ...(username && {username}),
            ...(email && {email}),
            ...(country && {country}),
            ...(imageUrl && {image: imageUrl})
        }

        const updatedUser = await UserModel.findByIdAndUpdate(id, {$set: updateData}, {upsert: true})
        return res.status(200).json({success: true, message: 'Profile update successfull.', data: updatedUser})
        
    } catch (error) {
        next(error)
    }
}


// Forgot Password api
// User Email Verify
exports.UserEamilVerify = async (req, res, next) => {
    try {
        // Email Account Query
        const email = req.params.email
        const OTPCode = Math.floor(100000 + Math.random() * 90000) // 6 digit otp code

        // Check User Exits
        const user = await UserModel.findOne({email})
        if(!user) {
            const err = new Error(`No user found !`)
                err.status = 404
                return next(err)
        }

        // save or update otp
        await OTPModel.findOneAndUpdate({email}, {otp: OTPCode, status: 0}, {upsert: true})
        // Send Email
        await EmailSend(email, `Your OTP Code is : ${OTPCode}`, 'Forgot Password Verification')

        return res.status(201).json({success: true, message: 'OTP sent successfull to your email.'})
    } catch (error) {
        next(error)
    }
}

// User OTP Verify
exports.UserOtpVerify = async (req, res, next) => {
    try {
        const {email, otp} = req.body
        const OTPCode = Number(otp)

        // 1. Check if OTP exists and is unused
        const otpRecord = await OTPModel.findOne({email, otp: OTPCode, status: 0})

        if(!otpRecord) {
            const err = new Error(`Invalid or expired OTP code. !`)
                err.status = 400
                return next(err)
        }

        // 2. Update status -> mark OTP as used
        otpRecord.status = 1
        await otpRecord.save()

        return res.status(200).json({success: true, message: 'OTP verified successfully.'})
    } catch (error) {
        next(error);
    }
}

// User Reset Password
exports.UserResetPassword = async (req, res, next) => {
    try {
        const {email, otp, newPassword } = req.body

        // 1. Basic validation
        if(!email || !otp || !newPassword) {
            const err = new Error("Email, OTP and new password are required.")
            err.status = 400
            return next(err)
        }

        // 2. Password length check
        if(newPassword.length < 6) {
            const err = new Error("New Password must be at least 6 characters.")
            err.status = 400
            return next(err)
        }

        // 3. Find OTP record that is verified (status = 1)
        const otpRecord = await OTPModel.findOne({email, otp: Number(otp), status: 1})
        if(!otpRecord) {
            const err = new Error("Invalid OTP or request.")
            err.status = 400
            return next(err)
        }

        // 4. Hash the new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        // 5. Update user's password
        const updatedUser = await UserModel.findOneAndUpdate({email}, {password: hashedPassword}, {upsert: true})
        if(!updatedUser) {
            const err = new Error('User not found.')
            err.status = 400
            return next(err)
        }

        // 6. Optional: mark OTP as used again (status = 2) to prevent reuse
        otpRecord.status = 2;
        await otpRecord.save();

        return res.status(200).json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        next(error)
    }
}