const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'campinggr',
        allowedFormats: ['jpeg', 'png', 'jpg'],
        transformation: [
            { width: 1024, height: 1024, crop: 'limit', quality: 'auto' }
        ]
    }
});

const limits = {
    fileSize: 2 * 1024 * 1024 // limit file size to 2MB
};

module.exports = {
    cloudinary,
    storage,
    limits
};
