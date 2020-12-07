// EXPRESS AND OTHER SETUP
const express = require('express');
const MongoUtil = require('./MongoUtil.js')
const ObjectId = require('mongodb').ObjectId;
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

    app.get('/food/:id/update', async(req,res)=>{

        // 1. fetch the existing record
        // use findOne() when we expect only one result
        let record = await db.collection('food').findOne({
            '_id': ObjectId(req.params.id)
        })

        // 2. pass the existing record to the hbs file so that
        // we can the existing information in the form
        res.render('edit_food', {
            'record': record
        })
    })

    app.post('/food/:id/update', async(req,res)=>{
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

        db.collection('food').updateOne({
            '_id':ObjectId(req.params.id)
        }, {
            '$set': newFoodRecord
        });

        res.redirect('/')

    })

    app.get('/food/:id/delete', async(req,res)=>{
        let foodRecord = await db.collection('food').findOne({
            '_id': ObjectId(req.params.id)
        })

        res.render('confirm_delete_food',{
            'record': foodRecord
        })
    })

    app.post('/food/:id/delete', async (req,res)=>{
        await db.collection('food').deleteOne({
            '_id':ObjectId(req.params.id)
        })
        res.redirect('/')
    })
}

main();

// LISTEN
app.listen(3000, ()=>{
    console.log("Express is running")
    
})