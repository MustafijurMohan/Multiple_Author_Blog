require('dotenv').config({quiet: true})
const app = require('./app')
const PORT = process.env.PORT || 4000


// Home Page Routes
app.get('/', (req, res) => {
    res.status(200).send(`Hello Everyone. This is a MERN Stack Multiple Author Blogging app.`)
})

// Undefined Routes
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})


// Global error handler
app.use((err, req, res, next) => {
    const status = err.status || 500

    res.status(status).json({
        success: false,
        message: err.message || "Server Error",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
})




app.listen(PORT, () => {
    console.log(`Server running Successfull at port :${PORT}`)
})
