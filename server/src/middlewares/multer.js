const multer = require('multer')

const storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({storage})
const uploadImage = upload.fields([{name: 'image', maxCount: 1}])

module.exports = uploadImage
