const validateCampground = (req, res, next) => {
    const campgroundSchema = Joi.object({
        title:       Joi.string().required(),
        image:       Joi.string().required(),
        price:       Joi.number().required().min(0),
        location:    Joi.string().required(),
        description: Joi.string().required(),
    })
    const { error } = campgroundSchema.validate(req.body.campground)
    if (error) {
        // const msg = error.message
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next()
    }
}

module.exports = validateCampground