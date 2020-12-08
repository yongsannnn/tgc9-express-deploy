const express = require('express');
const router = express.Router();
const MongoUtil = require('../MongoUtil')
const ObjectId = require('mongodb').ObjectId;
const UserModel = require('../models/UserModel')
const passport = require('../passport/setup');

let db = MongoUtil.getDB();

router.get('/register', async (req,res)=>{
    res.render('users/user_form')
})

router.post('/register', async (req,res)=>{
    await UserModel.createUser(req.body.username, req.body.email, req.body.password);
    req.flash("New user registered")
    res.redirect('/food')
})

// display a login form
router.get('/login', async (req, res)=>{
    res.render('users/login_form')
})

// process the login
router.post('/login', async (req,res,next)=>{
    // create a authentication function
    // first argument is 'local', means we want to use the local strategy
    let authProcess = passport.authenticate('local', async function(err,user,info){

        // if there is an error
        if (err) {
            res.send("Error logging in")
        }

        // if the user is not found (the email given is not in the mongo documents)
        if (!user) {
            res.send("User is not found")
        }

        // caution: the I below is upper case
        let loginError = req.logIn(user, (loginError)=>{
            if (loginError) {
                 res.send("Error logging in")
            } else {
                req.flash("Login successful!");
                res.redirect("/users/success");
            }
        })

    } );

    // call the function that will do authentication
    authProcess(req, res, next);
})

router.get('/profile', (req,res)=>{
    console.log(req.isAuthenticated());
    res.send(req.user);
})

router.get('/success', (req,res)=>{
    res.render('users/success_login',{
        'user': req.user
    })
})

module.exports = router;