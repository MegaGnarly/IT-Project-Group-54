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

// Main page which requires login to access
// Note use of authentication middleware here
authRouter.get('/user', isAuthenticated, (req, res) => {
    console.log("Loaded user homepage (authRouter.js)")
    console.log(req.user.username)
    res.render('user_homepage.hbs', {layout: 'main2', username: sessionStorage.getItem('username')})

    // res.render('patient_dashboard', { user: req.user.toJSON() })
})


// Login page (with failure message displayed upon login failure)
authRouter.get('/login', (req, res) => {
    res.render('login.hbs', { flash: req.flash('error'), title: 'Login', layout: 'main2' })
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

authRouter.get('/upload_fish', isAuthenticated, (req, res) => { 
    res.render('upload_fish.hbs', {layout: 'main2', username: sessionStorage.getItem('username')}) 
});
authRouter.get('/viewFish',appController.viewFish)

const upload = multer({dest: './uploads'});

authRouter.post('/', upload.single('image'), (req, res) => {

    var uploadedImage = new fish({
        angler: sessionStorage.getItem('username'),
        species: req.body.name,
        size: req.body.size,
        weight: req.body.weight,
        img: {
            data: fs.readFileSync('./uploads/' + req.file.filename),
            imgType: req.file.mimetype
        }
    });
  
    uploadedImage.save(err => {
        if(err) { console.log(err); return; }
        console.log('image saved');
        fs.unlinkSync('./uploads/' + req.file.filename);
        res.redirect('/viewFish');
    });
});
//-----------------------------------------------------------------


// Handle logout
authRouter.get('/logout', (req, res) => {
    console.log("Running Logout")
    req.logout()
    res.redirect('/')
})
module.exports = authRouter