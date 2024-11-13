const mongoose = require("mongoose");
const moment = require('moment');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    campground: {
        type: Schema.Types.ObjectId,
        ref: 'Campground'
    }
}, { timestamps: true });

reviewSchema.virtual('properties.lastUpdated').get(function () {
    return moment(this.updatedAt).fromNow();
});


reviewSchema.post("findOneAndDelete", async function (doc) {   //post middleware works just as well if no population is needed
    if (doc) {
        const Campground = require("./campground");
        const User = require("./user");
        await Campground.findByIdAndUpdate(doc.campground, { $pull: { reviews: doc._id } });
        const reviewAuthor = await User.findById(doc.author);
        if (reviewAuthor) {
            await reviewAuthor.updateOne({ $pull: { reviews: doc._id } });
        }
    }
});

module.exports = mongoose.model("Review", reviewSchema);
