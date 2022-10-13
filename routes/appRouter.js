//requirements-------------------------------------------------------
const express = require('express')
const appRouter = express.Router()
const sessionStorage = require('sessionstorage')
const appController = require('../controllers/appController')
require('../models/dbIndex')

//-----------------------------------------------------------------------------------

appRouter.get('/', appController.starFish)

appRouter.get('*', appController.starFish)

appRouter.get('/sign_up', (req, res) => { 
    res.render('sign_up.hbs') 
});

appRouter.post('/sign_up', appController.registerUser);

module.exports = appRouter