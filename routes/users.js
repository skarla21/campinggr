const express = require('express');
const router = express.Router();
const passport = require("passport");
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const { storeReturnTo, isLoggedIn, checkPassword, checkUsernameAvailability, checkEmailAvailability } = require('../middleware');


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(
        storeReturnTo,
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        users.login);

router.get('/logout', users.logout);

router.route('/profile')
    .get(isLoggedIn, users.showProfile)
    .delete(isLoggedIn, catchAsync(users.deleteProfile));

router.route('/profile/edit/username')
    .get(isLoggedIn, users.renderEditUsername)
    .put(isLoggedIn, checkPassword, catchAsync(checkUsernameAvailability), catchAsync(users.editUsername));

router.route('/profile/edit/email')
    .get(isLoggedIn, users.renderEditEmail)
    .put(isLoggedIn, checkPassword, catchAsync(checkEmailAvailability), catchAsync(users.editEmail));

router.route('/profile/edit/password')
    .get(isLoggedIn, users.renderEditPassword)
    .put(isLoggedIn, checkPassword, catchAsync(users.editPassword));

module.exports = router;
