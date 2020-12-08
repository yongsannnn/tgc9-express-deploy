// EXPRESS AND OTHER SETUP
const express = require('express');
const MongoUtil = require('./MongoUtil.js')
const ObjectId = require('mongodb').ObjectId;
const hbs = require('hbs')
const wax = require('wax-on')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
// allows us to inject into the environment (the OS) our environmental variabkes
require('dotenv').config();

// load in environment variables
require('dotenv').config();

// create the app
const app = express();
// use handlebars as the view engine (for templates) -- because there many other choices
app.set('view engine', 'hbs')
// we want our static files (images, css etc.) to be in a folder named public
app.use(express.static('public'))
// allows express to data submitted via forms
app.use(express.urlencoded({extended:false}))


 app.use(cookieParser("secret"))
 app.use(session({
     'cookie': {
         maxAge: 60000
     }
 }))
 app.use(flash())

// register a middleware for the flash message
app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
})

// setup template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

// handlebar helpers
 var helpers = require("handlebars-helpers")({
    handlebars: hbs.handlebars
  });


async function main() {
    const MONGO_URL=process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "tgc9_cico");

    const foodRoutes = require('./routes/foodRoutes')
    const landingRoutes = require('./routes/landingRoutes')
    
    app.use('', landingRoutes);
    app.use('/food', foodRoutes);

}

main();

// LISTEN
app.listen(3000, ()=>{
    console.log("Express is running")
})