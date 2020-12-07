// EXPRESS AND OTHER SETUP
const express = require('express');
const MongoUtil = require('./MongoUtil.js')
const hbs = require('hbs')
const wax = require('wax-on')
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

// setup template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

async function main() {
    const MONGO_URL=process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "tgc9_cico");
    let db = MongoUtil.getDB();

    app.get('/', async (req,res)=>{
        let food = await db.colleciton('food').find().toArray();
        res.render('food',{
            'foodRecords':food
        })
    })

    // display the form to allow the user to add a food consumption
    app.get('/food/add', (req,res)=>{
        res.render('add_food')
    })
}

main();

// LISTEN
app.listen(3000, ()=>{
    console.log("Express is running")
    
})