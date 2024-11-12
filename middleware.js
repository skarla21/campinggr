const { campgroundSchema, reviewSchema } = require('./schemas.js');
const Campground = require("./models/campground");
const Review = require("./models/review");
const User = require("./models/user");
const passport = require("passport");
const { cloudinary } = require("./cloudinary");
const ExpressError = require('./utils/ExpressError');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.checkPassword = (req, res, next) => {
    const { password } = req.body;
    const { username } = res.locals.currentUser;
    // to determine the redirect
    const userInputUser = req.body.username;
    const userInputEmail = req.body.email;

    // re-authenticate the user with the provided password
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            req.flash("error", "An error occurred during authentication.");
            if (userInputUser) {
                return res.redirect("/profile/edit/username");
            } else if (userInputEmail) {
                return res.redirect("/profile/edit/email");
            } else {
                return res.redirect("/profile/edit/password");
            }
        }
        if (!user) {
            req.flash("error", "Incorrect password!");
            if (userInputUser) {
                return res.redirect("/profile/edit/username");
            } else if (userInputEmail) {
                return res.redirect("/profile/edit/email");
            } else {
                return res.redirect("/profile/edit/password");
            }
        }
        next();
    })({ body: { username, password } }); // pass `username` and `password` to authenticate
};

module.exports.checkUsernameAvailability = async (req, res, next) => {
    const { username } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        req.flash("error", "Username already taken. Please choose a different one.");
        return res.redirect("/profile/edit/username");
    }
    next();
};

module.exports.checkEmailAvailability = async (req, res, next) => {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        req.flash("error", "Email already in use. Please choose a different one.");
        return res.redirect("/profile/edit/email");
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash('error', 'Cannot find that review!');
        return res.redirect(`/campgrounds/${id}`);
    }
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = async (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        if (req.files) {
            req.files.forEach(async (f) => {
                await cloudinary.uploader.destroy(f.filename);
            })
        }
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
