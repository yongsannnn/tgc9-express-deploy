const express = require('express');
const router = express.Router();
const MongoUtil = require('../MongoUtil')

let db = MongoUtil.getDB();

router.get('/', async (req,res)=>{
    let food = await db.collection('food').find().toArray();
    res.render('food',{
        'foodRecords':food
    })
})

 // display the form to allow the user to add a food consumption
router.get('/add', async (req,res)=>{
    res.render('add_food')
})

router.post('/add', async (req,res)=>{
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
    req.flash('success_messages', 'New food record has been created')
    res.redirect('/')
})

router.get('/:id/update', async(req,res)=>{

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

router.post('/:id/update', async(req,res)=>{
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

router.get('/:id/delete', async(req,res)=>{
    let foodRecord = await db.collection('food').findOne({
        '_id': ObjectId(req.params.id)
    })

    res.render('confirm_delete_food',{
        'record': foodRecord
    })
})

router.post('/:id/delete', async (req,res)=>{
    await db.collection('food').deleteOne({
        '_id':ObjectId(req.params.id)
    })
    req.flash('error_messages', "Food record has been deleted")
    res.redirect('/')
})

module.exports = router;