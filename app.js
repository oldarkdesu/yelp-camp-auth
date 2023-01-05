const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");
const userRoutes = require('./routes/users');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => {
    const d = new Date()
    console.log(`Connected to MongoDB @ ${d.toLocaleTimeString()}`)
})
.catch(err => {
    console.log('Error connecting to MongoDB\n', err)
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const session_config = {
    secret: "this-is-not-a-good-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7), // 1 week from now
        maxAge: (1000 * 60 * 60 * 7)
    }
}
app.use(session(session_config));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);


app.use((req,res,next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

/* routes */
app.use('/', userRoutes)
app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews", reviews)

app.get('/', (req, res) => {
    res.render('home')
})

/* Error handling */
app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not found"))
})

app.use((err, req, res, next) => {
    const { status = 500,
            message = "No way nerd",
            stack = "(no stack trace)" } = err
    res.status(status).render('error', { status, stack, message })
})

app.listen(7777, () => { console.log("Listening on port 7777") })