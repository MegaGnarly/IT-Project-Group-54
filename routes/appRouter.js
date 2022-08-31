//requirements-------------------------------------------------------
const express = require('express')
const appRouter = express.Router()
const sessionStorage = require('sessionstorage')
const appController = require('../controllers/appController')
require('../models/dbIndex')


appRouter.get('/', (req, res) => {
    res.render('homepage.hbs', {username: sessionStorage.getItem('username')})
})

appRouter.get('/sign_up', (req, res) => { 
    res.render('sign_up.hbs') 
});

appRouter.post('/sign_up', appController.registerUser);



module.exports = appRouter