//requires fish and user model----------------------------------
const sessionStorage = require('sessionstorage')
var fish = require('../models/fish');
var User = require('../models/user');

// sort fishes in view fish page------------------------------------------------
var sort = null;
const sortWithSize = async (req,res) => {
    sort = {size: -1};
    return res.redirect('/viewFish')
}
const sortWithTime = async (req,res) => {
    sort = {time: -1};
    return res.redirect('/viewFish')
}
const sortWithWeight = async (req,res) => {
    sort = {weight: -1};
    return res.redirect('/viewFish')
}
const resetSort = async (req,res) => {
    sort = null;
    return res.redirect('/viewFish')
}

// viewing fish page--------------------------------------------------------------

const viewFish = async (req,res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    var user = true;
    fish.find({angler: sessionStorage.getItem('username')}, (err, fishes) => {
        fishes = fishes.map((fish) => {
            fish.img.data = fish.img.data.toString('base64');
            return fish.toObject();
        });
        console.log(sessionStorage.getItem('username'))
        res.render('viewFish.hbs', {layout: "mainLoggedIn.hbs", fishes: fishes, user});
    }).sort(sort);
    sort = null;
}

// render the details of one fish-------------------------------------------
const fishDetails = async (req,res) => {
    
    fish.find({_id: req.params._id}, (err, fishes) => {
        console.log(req.params._id);
        var user = false;
        fishes = fishes.map((fish) => {
            fish.img.data = fish.img.data.toString('base64');
            console.log(fish.angler);
            if (fish.angler==sessionStorage.getItem("username")){
                user = true;
            }
            return fish.toObject();
        });
        
        res.render('fishDetails.hbs', {layout: "mainLoggedIn.hbs",fishes: fishes, user});
    });

}

// delete an unwanted record----------------------------------------------------
const deleteFish = async (req,res) => {
    var info = {_id: req.params._id};
    fish.deleteOne(info, function(err, obj) {if (err) throw err;});
    return res.redirect("/viewFish")
    
}

// update details of one fish-------------------------------------------------
const updateFish = async (req,res) => {

    var info = {_id: req.params._id};

    var newvalues = { $set: {species: req.body.name,
        size: req.body.size,
        weight: req.body.weight} };
    
    fish.updateOne(info, newvalues, function(err, obj) {if (err) throw err;});
    
    return res.redirect("/viewFish")
}

// register user --------------------------------------

const registerUser = async (req, res) => {
    if ((req.body.password != req.body.rpassword) || req.body.password === "") { 
        return res.render('sign_up.hbs', {error: true, errorMessage: "Please verify that your passwords match and try again.", layout: 'main'})
    }
        const newUser = new User ({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: req.body.password 
        })
        try{
            await newUser.save();
            console.log('New user registered')
            return res.redirect('/login');
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
    updateFish,
    sortWithSize,
    sortWithTime,
    sortWithWeight,
    resetSort
}