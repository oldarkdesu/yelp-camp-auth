const express = require("express")
const router = express.Router({mergeParams: true})
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require("../models/review")
const {reviewSchema} = require("../schemas.js")


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        // const msg = error.message
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next()
    }
}


/* Create a review */
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    res.redirect(`/campgrounds/${camp.id}`)
}))

/* Delete a review */
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id , reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router
