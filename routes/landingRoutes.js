const express = require('express')
const router = express.Router();
const MongoUtil = require('../MongoUtil');

let db = MongoUtil.getDB();

router.get('/', (req,res)=>{
    res.send("Hello world");
})

router.get('/about-us', (req,res)=>{
    res.send("About us")
})

module.exports = router;