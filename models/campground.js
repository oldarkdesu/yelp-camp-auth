const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    image: String,
    location: String,
    reviews: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Review" 
    }]
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (!doc) { return }
    await Review.deleteMany({ _id: {$in: doc.reviews} })
})

module.exports = mongoose.model('Campground', campgroundSchema)