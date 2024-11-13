const mongoose = require("mongoose");
const moment = require('moment');
const Schema = mongoose.Schema;
const { cloudinary } = require("../cloudinary");

const opts = {
  toJSON: { virtuals: true },
  timestamps: true
};

const campgroundSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String
    }
  ],
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 40)}...</p>`;
});

campgroundSchema.virtual('properties.createdAt').get(function () {
  return moment(this.createdAt).fromNow();
});

campgroundSchema.virtual('properties.lastUpdated').get(function () {
  return moment(this.updatedAt).fromNow();
});


campgroundSchema.pre("findOneAndDelete", async function (next) {
  const Review = require('./review');
  const User = require('./user');
  const campgroundId = this.getQuery()._id;
  const campgroundDoc = await this.model.findById(campgroundId)
    .populate("reviews");
  for (let review of campgroundDoc.reviews) {
    const reviewAuthor = await User.findById(review.author);
    if (reviewAuthor) {
      await reviewAuthor.updateOne({ $pull: { reviews: review._id } });
    }
    await Review.findByIdAndDelete(review._id);
  }
  const campAuthor = await User.findById(campgroundDoc.author); //if author user exists
  if (campAuthor) {
    await campAuthor.updateOne({ $pull: { campgrounds: campgroundDoc._id } });
  }
  for (let img of campgroundDoc.images) {
    await cloudinary.uploader.destroy(img.filename);
  }
  next();
});

module.exports = mongoose.model("Campground", campgroundSchema);
