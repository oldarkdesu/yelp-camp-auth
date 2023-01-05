const express = require("express")
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require("../schemas.js")
const {isLoggedIn} = require('../middleware')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        // const msg = error.message
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next()
    }
}

/* Show all campgrounds */
router.get('/', wrapAsync(async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}))

/* Create new campground */
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})
router.post('/', validateCampground, wrapAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campground)
    await camp.save()
    req.flash('success', 'Successfuly made a new campground!')
    res.redirect(`campgrounds/${camp._id}`)
}))

/* Show a single campground */
router.get('/:id', wrapAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate("reviews")
    if(!camp){
        req.flash('error', 'Campground not found :(')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/details', { camp })
}))

/* Edit a campground */
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { camp })
}))
router.patch('/:id', isLoggedIn, validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(
        id,
        req.body.campground,
        // { runValidators: true }
    )
    req.flash('success', 'Successfuly updated a campground!')
    res.redirect(`/campgrounds/${id}`)
}))

/* Delete a campground */
router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfuly deleted a campground!')
    res.redirect('/campgrounds')
}))

module.exports = router
