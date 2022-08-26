//requirements-------------------------------------------------------
const express = require('express')
const appRouter = express.Router()
const appController = require('../controllers/appController')
require('../model/dbIndex')

var fs = require('fs');
var path = require('path');
var fish = require('../model/fish');

var multer = require('multer');

appRouter.get('/', (req, res) => {
    res.render('homepage.hbs')
})

appRouter.get('/user', (req, res) => {
    res.render('user_homepage.hbs')
})
      
//store the fish in local disk first---------------------------------
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'router/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

//upload the fish to db----------------------------------------------
/*
var upload = multer({ storage: storage });

appRouter.get('/',appController.viewFish)
appRouter.post('/', upload.single('image'), (req, res, next) => {
      
    var obj = {
        angler: req.body.angler,
        species: req.body.name,
        size: req.body.size,
        weight: req.body.weight,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    fish.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    });
});
*/

module.exports = appRouter