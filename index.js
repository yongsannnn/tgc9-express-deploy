// EXPRESS AND OTHER SETUP
const express = require('express');
const {setupExpressApp} = require('./setupExpress');
const {setupHBS} = require('./setupHBS');
const MongoUtil = require('./MongoUtil.js');


// allows us to inject into the environment (the OS) our environmental variabkes
require('dotenv').config();

// create the app
const app = express();
setupExpressApp(app);
setupHBS();

async function main() {
    const MONGO_URL=process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "tgc9_cico");

    const foodRoutes = require('./routes/foodRoutes')
    const landingRoutes = require('./routes/landingRoutes')
    const userRoutes = require('./routes/userRoutes')


    app.use('', landingRoutes);
    app.use('/food', foodRoutes);
    app.use('/users', userRoutes);

}

main();

// LISTEN
app.listen(process.env.PORT, ()=>{
    console.log("Express is running")
})