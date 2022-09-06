//requires fish and user model----------------------------------
const sessionStorage = require('sessionstorage')
var fish = require('../models/fish');
var User = require('../models/user');

//render the view fish page--------------------------------------------------------------------------------
const viewFish = async (req,res) => {
    fish.find({angler: sessionStorage.getItem('username')}, (err, images) => {
        images = images.map((image) => {
            image.img.data = image.img.data.toString('base64');
            return image.toObject();
        });
        console.log(sessionStorage.getItem('username'))
        res.render('viewFish.hbs', {images: images});
    });
}

// render the details of one fish-------------------------------------------
const fishDetails = async (req,res) => {
    fish.find({_id: req.params._id}, (err, images) => {
        console.log(req.params._id);
        images = images.map((image) => {
            image.img.data = image.img.data.toString('base64');
            console.log(image.angler);
            return image.toObject();
        });
        res.render('fishDetails.hbs', {images: images});
    });
}

// delete an unwanted record----------------------------------------------------
const deleteFish = async (req,res) => {
    var info = {_id: req.params._id};
    fish.remove(info, function(err, obj) {if (err) throw err;});
    fish.find({angler: sessionStorage.getItem('username')}, (err, images) => {
        images = images.map((image) => {
            image.img.data = image.img.data.toString('base64');
            return image.toObject();
        });
        console.log(images._id)
        res.render('viewFish.hbs', {images: images});
    });
}

// update details of one fish-------------------------------------------------
const updateFish = async (req,res) => {

    var info = {_id: req.params._id};

    var newvalues = { $set: {species: req.body.name,
        size: req.body.size,
        weight: req.body.weight} };
    
    fish.updateOne(info, newvalues, function(err, obj) {if (err) throw err;});
    
    fish.find({angler: sessionStorage.getItem('username')}, (err, images) => {
        images = images.map((image) => {
            image.img.data = image.img.data.toString('base64');
            return image.toObject();
        });
        console.log(images._id)
        res.render('viewFish.hbs', {images: images});
    });
}

// register user --------------------------------------

const registerUser = async (req, res) => {
    const newUser = new User ({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password 
    })
    try{
        await newUser.save();
        console.log('New user registered')
        return res.redirect('./');
    } catch (err) {
        console.log("Error when registering user");
        console.log(err);
        res.status(400).send(err);
        return res.redirect('./');
    }
};


//exports----------------------------------------------
module.exports = {
    viewFish,
    registerUser,
    fishDetails,
    deleteFish,
    updateFish
}