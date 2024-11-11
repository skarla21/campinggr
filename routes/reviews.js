const express = require('express');
const router = express.Router({ mergeParams: true });  //pass the params of the route prefix
const catchAsync = require("../utils/catchAsync");
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.get("/:reviewId/edit", isLoggedIn, isReviewAuthor, catchAsync(reviews.editReview));

router.route("/:reviewId")
    .put(isLoggedIn, isReviewAuthor, validateReview, catchAsync(reviews.updateReview))
    .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
