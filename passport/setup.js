const UserModel = require('../models/UserModel')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs')

// 1. How to serialize the user to the session (aka. save the user information to session)
// this happens when the user logs in, Express need to save the user document to session 
// .ie associate the session id with a particular user
passport.serializeUser(function(user, done){
    // Note: the user argument will be a user document from my mongo DB. Passport will somehow pass this us to this
    // first arugment for done means there is no error
    // second argument is what data from the user document we want to save to session
    done(null, user._id);
})

// 2. Deserialize user (i.e, given a session id, retrieve the user information)
// this is needed on subsequent visits
passport.deserializeUser(async function(id, done){
    let user = await UserModel.findUserById(id);
    // first arugment is null means there is no error
    // second argument is the user document
    done(null, user);
})

// 3. How do we authenticate
// i.e two qns to answer:
//   a) does the user exists (if provided username/email and password)
//   b) if the user exists, is the password correct
passport.use(
    new LocalStrategy({
        'usernameField':'email'
    }, async function(email, password, done){
        // to answer a) does the user exists, given the email?
        let user = await UserModel.findUserByEmail(email);
        // to answer b) does the password match?
        if (user && bcrypt.compareSync(password, user.password)) {
            console.log("user logged in successfully in passport")
            // all good- the user exists, and the password matches
              done(null, user);  
        } else {
            done(null, false, {
                message:'Invalid login'
            })
        }
    })
)

module.exports = passport;