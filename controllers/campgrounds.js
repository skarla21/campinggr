const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

//google api
const axios = require("axios");
const googleApiKey = process.env.GOOGLE_GEOCODING_API_KEY;
// //mapbox
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);

    // //with mapbox api
    // const geoData = await geocoder.forwardGeocode({
    //     query: req.body.campground.location,
    //     countries: ['GR'], // Limit search to Greece
    //     limit: 1
    // }).send();
    // campground.geometry = geoData.body.features[0].geometry;

    //with google api
    const geoData = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: req.body.campground.location,
            region: 'GR',   // Bias towards Greece
            key: googleApiKey
        }
    });
    const coords = geoData.data.results[0].geometry.location;
    const geometry = {
        type: 'Point',
        coordinates: [coords.lng, coords.lat] // GeoJSON format [longitude, latitude]
    }
    campground.geometry = geometry;

    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.description = campground.description.trim();
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const updatedInfo = {
        title: req.body.campground.title,
        price: req.body.campground.price,
        description: req.body.campground.description.trim(),
        $push: { images: req.files.map(f => ({ url: f.path, filename: f.filename })) }
    };
    if (campground.location.trim() !== req.body.campground.location.trim()) {
        const geoData = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: req.body.campground.location,
                region: 'GR',   // Bias towards Greece
                key: googleApiKey
            }
        });
        const coords = geoData.data.results[0].geometry.location;
        const geometry = {
            type: 'Point',
            coordinates: [coords.lng, coords.lat] // GeoJSON format [longitude, latitude]
        }
        updatedInfo.location = req.body.campground.location;
        updatedInfo.geometry = geometry;
    }

    await campground.updateOne(updatedInfo);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id); // mongoose middleware for reviews & images deletion
    req.flash('success', 'Successfully deleted campground!');
    res.redirect("/campgrounds");
};