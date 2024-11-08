const express = require('express');
const router = express.Router({ mergeParams: true });  //pass the params of the route prefix
const catchAsync = require("../utils/catchAsync");
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;

// router.put("/:reviewId", isLoggedIn, isReviewAuthor, validateReview, catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     const updatedReview = {
//         body: req.body.review.body.trim(),
//         rating: req.body.review.rating,
//         author: req.user._id
//     };
//     await Review.findByIdAndUpdate(reviewId, updatedReview);
//     req.flash('success', 'Successfully updated review!');
//     res.redirect(`/campgrounds/${id}`);
// }));
