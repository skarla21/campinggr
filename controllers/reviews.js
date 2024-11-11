const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.body = review.body.trim();
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'New review added!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.editReview = async (req, res) => {
    const review = await Review.findById(req.params.reviewId).populate('author');
    const campground = await Campground.findById(req.params.id);
    res.render("reviews/edit", { review, campground });
};

module.exports.updateReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const updatedReview = {
        body: req.body.review.body.trim(),
        rating: req.body.review.rating,
        author: req.user._id
    };
    await Review.findByIdAndUpdate(reviewId, updatedReview);
    req.flash('success', 'Successfully updated review!');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review!');
    res.redirect(`/campgrounds/${id}`);
};
