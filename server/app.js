const express = require('express')
const app = express()


// Security Middleware Require
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const hpp = require('hpp')
const xss = require('xss')
const { connectDB } = require('./src/config/database')
const { connectCloudinary } = require('./src/config/cloudinary')
const router = require('./src/routes/api')

// Express Implement
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended: true, limit: '50mb'}))


// Security Middleware Implement
app.use(helmet())
app.use(hpp())
app.use(cors({
    origin: [
        "http://localhost:5173",
		"http://localhost:3000",
        "https://multiple-author-blog-eacg.vercel.app",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}))


// Simple middleware to sanitize input
app.use((req, res, next) => {
    if(req.body) {
        for(let key in req.body) {
            if(typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key])
            }
        }
    }
    next()
})

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// // Apply the rate limiting middleware to all requests.
// // app.use(limiter)
if (process.env.NODE_ENV === "production") {
	app.use(limiter);
}

// Database Connection
connectDB()

// Cloudinary Connection
connectCloudinary()

// Managing api routing
app.use('/api/v1', router)



module.exports = app