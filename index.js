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

// handlebar helpers
 var helpers = require("handlebars-helpers")({
    handlebars: hbs.handlebars
  });


async function main() {
    const MONGO_URL=process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "tgc9_cico");
    let db = MongoUtil.getDB();

    app.get('/', async (req,res)=>{
        let food = await db.collection('food').find().toArray();
        res.render('food',{
            'foodRecords':food
        })
    })

    // display the form to allow the user to add a food consumption
    app.get('/food/add', async (req,res)=>{
        res.render('add_food')
    })

    app.post('/food/add', async (req,res)=>{
          // use object destructuring to extract each of the input
        // of the form
        let { name, calories, meal, date, tags } = req.body;
        // same as...
        // let name = req.body.name;
        // let calories = req.body.calories;
        // ...
        // let tags = req.body.tags

        let newFoodRecord = {
            'name': name,
            'calories': parseFloat(calories),
            'meal':meal,
            'date':new Date(date),
            'tags':tags
        }

        await db.collection('food').insertOne(newFoodRecord);
        res.redirect('/')
    })
}

main();

// LISTEN
app.listen(3000, ()=>{
    console.log("Express is running")
    
})