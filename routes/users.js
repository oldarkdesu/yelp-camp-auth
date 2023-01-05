const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user')
const wrapAsync = require('../utils/wrapAsync')

router.get('/register', (req, res) => {
    res.render('users/register')
})
router.post('/register', wrapAsync( async (req, res) => {
    try{
        const {email, username, password} = req.body
        const new_user = new User({email, username})
        const registered_user = await User.register(new_user, password)
        req.flash('success', 'Welcome to yelp-camp!')
        res.redirect('/campgrounds')
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
}))
router.get('/login', (req, res) => {
    res.render('users/login')
})

const authenticate = function (req, res, next) {
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' })(req, res, next)
    next()
}
router.post('/login', authenticate, (req, res) => {
    req.flash('success', 'Welcome back, glad to have you here')
    res.redirect('/campgrounds')
})

module.exports = router