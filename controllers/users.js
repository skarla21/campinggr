const User = require('../models/user');

module.exports.renderRegister = async (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to camping.gr!');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'Logged out.');
        res.redirect('/campgrounds');
    });
};

module.exports.showProfile = async (req, res) => {
    const populatedUser = await User.findById(res.locals.currentUser._id)
        .populate('campgrounds')
        .populate({ path: 'reviews', populate: { path: 'campground' } });
    res.locals.currentUser = populatedUser;
    res.render('users/show');
};

module.exports.renderEditUsername = (req, res) => {
    res.render('users/editUsername');
};

module.exports.editUsername = async (req, res, next) => {
    const { username } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(userId, { username }, { new: true });
    req.logout(err => {
        if (err) return next(err);
        req.login(user, err => {
            if (err) return next(err);
            req.flash("success", "Username updated successfully!");
            res.redirect("/profile");
        });
    });
};

module.exports.renderEditEmail = (req, res) => {
    res.render('users/editEmail');
};

module.exports.editEmail = async (req, res, next) => {
    const { email } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(userId, { email }, { new: true });
    req.logout(err => {
        if (err) return next(err);
        req.login(user, err => {
            if (err) return next(err);
            req.flash("success", "Email updated successfully!");
            res.redirect("/profile");
        });
    });
};

module.exports.renderEditPassword = (req, res) => {
    res.render('users/editPassword');
};

module.exports.editPassword = async (req, res, next) => {
    const { password, new_password } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    await user.setPassword(new_password);
    await user.save();

    req.logout(err => {
        if (err) return next(err);
        req.login(user, err => {
            if (err) return next(err);
            req.flash("success", "Password updated successfully!");
            res.redirect("/profile");
        });
    });
};

module.exports.deleteProfile = async (req, res, next) => {
    await User.findByIdAndDelete(req.user._id);
    req.logout(async err => {
        if (err) return next(err);
        req.flash('success', 'User deleted!');
        res.redirect('/campgrounds');
    });
};
