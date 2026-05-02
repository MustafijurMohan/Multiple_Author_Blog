require('dotenv').config({quiet: true})
const mongoose = require('mongoose')
const URL = process.env.MONGO_URI

exports.connectDB = async () => {
    try {
        await mongoose.connect(URL)
        console.log(`Database Connection Successfull.`)
    } catch (error) {
        console.log(`Database Connection Error: ${error.message}` )
    }
}