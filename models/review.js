const mongoose = require("mongoose");
const moment = require('moment');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

reviewSchema.virtual('properties.lastUpdated').get(function () {
    return moment(this.updatedAt).fromNow();
});

module.exports = mongoose.model("Review", reviewSchema);