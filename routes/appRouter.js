//requirements-------------------------------------------------------
const express = require('express')
const appRouter = express.Router()
const sessionStorage = require('sessionstorage')
const appController = require('../controllers/appController')
require('../models/dbIndex')

/*
appRouter.get('/', (req, res) => {
    res.render('homepage.hbs', {username: sessionStorage.getItem('username')})
})
*/
appRouter.get('/', appController.weekFish)
appRouter.post('/search', (req, res) => {

    var regex = { $regex: req.body.name, $options: "xi" };
    var fish = require('../models/fish');

    fish.find({species: regex}, (err, fishes) => {
        fishes = fishes.map((fish) => {
            fish.img.data = fish.img.data.toString('base64');
            return fish.toObject();
        });
        res.render('searchResult.hbs', {layout: "main.hbs", fishes: fishes});
    })
    
});

appRouter.get('/sign_up', (req, res) => { 
    res.render('sign_up.hbs') 
});

appRouter.post('/sign_up', appController.registerUser);



module.exports = appRouter