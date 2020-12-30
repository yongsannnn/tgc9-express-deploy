const express = require('express');
const session = require('express-session')
const hbs = require('hbs')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const passport = require('./passport/setup');

function setupExpressApp(app) {
    // use handlebars as the view engine (for templates) -- because there many other choices
    app.set('view engine', 'hbs')
    // we want our static files (images, css etc.) to be in a folder named public
    app.use(express.static('public'))
    // allows express to data submitted via forms
    app.use(express.urlencoded({ extended: false }))


    app.use(cookieParser("secret"))
    app.use(session({
        'cookie': {
            maxAge: 60000
        }
    }))
    app.use(flash())

    // register a middleware for the flash message
    app.use(function (req, res, next) {
        res.locals.success_messages = req.flash('success_messages');
        res.locals.error_messages = req.flash('error_messages');
        next();
    })

    app.use(passport.initialize());
    app.use(passport.session())
 

}

module.exports = { setupExpressApp };