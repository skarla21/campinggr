const mongoose = require("mongoose");
const Review = require('./review');
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



campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
    for (let img of doc.images) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
