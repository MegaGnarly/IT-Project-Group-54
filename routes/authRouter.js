/**
 * this file is wrote to process requests when app is logged in
 */
// imported packages-----------------------------------------------------
const passport = require('passport')
const express = require('express')
const authRouter = express.Router()
const bodyParser = require('body-parser')
const sessionStorage = require('sessionstorage')
const appController = require('../controllers/appController.js')
const user = require('../models/user')

authRouter.use(bodyParser.urlencoded({ extended: false }));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}


// Login page (with failure message displayed upon login failure)
authRouter.get('/login', (req, res) => {
    res.render('login.hbs', { flash: req.flash('error'), title: 'Login', layout: 'main' })
})

authRouter.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login', failureFlash: true
    }),
    function(req, res){
        sessionStorage.setItem('username', req.user.username)
        return res.redirect('/user')

    }
)

//upload the fish to db----------------------------------------------

var fs = require('fs');
var path = require('path');
var fish = require('../models/fish');

var multer = require('multer');
const { setRandomFallback } = require('bcryptjs')

authRouter.get('/upload_fish', isAuthenticated, (req, res) => { 
    res.render('upload_fish.hbs', {layout: 'mainLoggedIn', user: sessionStorage.getItem('username')}) 
});
authRouter.get('/viewFish',appController.viewFish)

const upload = multer({dest: './uploads'});

authRouter.post('/', upload.single('image'), (req, res) => {

    if (!req.file.originalname.match(/\.(jpg|png)$/)){
        fs.unlinkSync('./uploads/' + req.file.filename);
        return res.redirect('/upload_fish');
    }
    
    date = appController.getDateString();

    var uploadedFish = new fish({
        angler: sessionStorage.getItem('username'),
        time: Date.now(),
        displayDate: date,
        species: req.body.name.trim(),
        size: req.body.size,
        weight: req.body.weight,
        weather: req.body.weather,
        period: req.body.period,
        location: req.body.location.trim(),
        mates: req.body.mates.trim(),
        img: {
            data: fs.readFileSync('./uploads/' + req.file.filename),
            imgType: req.file.mimetype
        }
    });
  
    uploadedFish.save(err => {
        if(err) { console.log(err); return; }
        console.log('fish saved');
        fs.unlinkSync('./uploads/' + req.file.filename);
        res.redirect('/viewFish');
    });

});

// fish detail page related-------------------------------------------------
authRouter.get('/fishDetails/:_id',appController.fishDetails)
authRouter.get('/delete/:_id',appController.deleteFish)
authRouter.post('/fishDetails/:_id',appController.updateFish)

// fish viewing page related------------------------------------------------
authRouter.post('/search', appController.fishFilter)
authRouter.get('/user', appController.user)
authRouter.get('/suggestion', (req, res) => { 
    res.render('recommend.hbs', {layout: 'mainLoggedIn', user: sessionStorage.getItem('username')}) 
});
authRouter.post('/suges',appController.recommend)


//-----------------------------------------------------------------


// Handle logout
authRouter.post('/logout', (req, res) => {
    console.log("Running Logout")
    sessionStorage.clear()
    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        res.redirect('/');
    });
});
module.exports = authRouter