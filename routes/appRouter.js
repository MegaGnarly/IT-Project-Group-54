//requirements-------------------------------------------------------
const express = require('express')
const appRouter = express.Router()
const appController = require('../controllers/appController')
require('../models/dbIndex')

var fs = require('fs');
var path = require('path');
var fish = require('../models/fish');

var multer = require('multer');

appRouter.get('/', (req, res) => {
    res.render('homepage.hbs')
})

appRouter.get('/user', (req, res) => {
    res.render('user_homepage.hbs')
})

appRouter.get('/sign_up', (req, res) => { 
    res.render('sign_up.hbs') 
});

appRouter.post('/sign_up', appController.registerUser);

//upload the fish to db----------------------------------------------

appRouter.get('/upload_fish', (req, res) => { 
    res.render('upload_fish.hbs') 
});
appRouter.get('/viewFish',appController.viewFish)

const upload = multer({dest: './uploads'});

appRouter.post('/', upload.single('image'), (req, res) => {

    var uploadedImage = new fish({
        angler: req.body.angler,
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

module.exports = appRouter