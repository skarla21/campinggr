const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const user = await User.findById(req.user._id);
    const review = new Review(req.body.review);

    review.body = review.body.trim();
    review.author = req.user._id;
    review.campground = campground;
    campground.reviews.push(review);
    user.reviews.push(review);
    await review.save();
    await campground.save();
    await user.save();
    req.flash('success', 'New review added!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.editReview = async (req, res) => {
    const review = await Review.findById(req.params.reviewId);
    const campground = await Campground.findById(req.params.id);
    res.render("reviews/edit", { review, campground });
};

module.exports.updateReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const updatedReview = {
        body: req.body.review.body.trim(),
        rating: req.body.review.rating
    };
    await Review.findByIdAndUpdate(reviewId, updatedReview);
    req.flash('success', 'Successfully updated review!');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review!');
    res.redirect(`/campgrounds/${id}`);
};
