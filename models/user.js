const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    campgrounds: [
        {
            type: Schema.Types.ObjectId,
            ref: "Campground"
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    roles: [{
        type: String,
        enum: ['admin']    // for now role will be entered manually in database
    }]
});
UserSchema.plugin(passportLocalMongoose);


UserSchema.pre("findOneAndDelete", async function (next) {
    const Review = require('./review');
    const Campground = require('./campground');
    const userId = this.getQuery()._id;
    const userDoc = await this.model.findById(userId)
        .populate("reviews")
        .populate("campgrounds");
    for (let review of userDoc.reviews) {
        await Review.findByIdAndUpdate(review._id, { author: null });
    }
    for (let campground of userDoc.campgrounds) {
        await Campground.findByIdAndUpdate(campground._id, { author: null });
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
