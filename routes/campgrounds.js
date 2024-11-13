const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isCampgroundAuthor, validateCampground } = require('../middleware');

const multer = require('multer');
const { storage, limits } = require('../cloudinary');
const upload = multer({ storage, limits });


router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,
        upload.array('image'),
        catchAsync(validateCampground),
        catchAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,
        isCampgroundAuthor,
        upload.array('image'),
        catchAsync(validateCampground),
        catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isCampgroundAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isCampgroundAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
