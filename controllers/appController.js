//requires fish and user model----------------------------------
const sessionStorage = require('sessionstorage')
var fish = require('../models/fish');
var User = require('../models/user');

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
    })
}

// filter function in viewFish page-------------------------------------------------------
const fishFilter = async (req,res) => {

    var sort = null;
    var sortAttribute = req.body.sort;
    if (sortAttribute == 'default'){
        sort = null;
    }else if (sortAttribute == 'time'){
        sort = {time: -1};
    }else if (sortAttribute == 'weight'){
        sort = {weight: -1};
    }else if (sortAttribute == 'size'){
        sort = {size: -1};
    }

    var searchAttribute = req.body.target;
    var regex = { $regex: req.body.name, $options: "xi" };
    if (searchAttribute == 'species'){
        fish.find({angler: sessionStorage.getItem('username'), species: regex}, (err, fishes)=>action(fishes)).sort(sort);
    }else if (searchAttribute == 'weather'){
        fish.find({angler: sessionStorage.getItem('username'), weather: regex}, (err, fishes)=>action(fishes)).sort(sort);
    }else if (searchAttribute == 'location'){
        fish.find({angler: sessionStorage.getItem('username'), location: regex}, (err, fishes)=>action(fishes)).sort(sort);
    }else if (searchAttribute == 'mates'){
        fish.find({angler: sessionStorage.getItem('username'), mates: regex}, (err, fishes)=>action(fishes)).sort(sort);
    }

    function action(fishes){
        fishes = fishes.map((fish) => {
            fish.img.data = fish.img.data.toString('base64');
            return fish.toObject();
        });
        res.render('viewFish.hbs', {layout: "mainLoggedIn.hbs", fishes: fishes});
        searchAttribute = null;
    }
    
};

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
        weight: req.body.weight,
        weather: req.body.weather,
        location: req.body.location,
        mates: req.body.mates} };
    
    fish.updateOne(info, newvalues, function(err, obj) {if (err) throw err;});
    
    return res.redirect("/viewFish")
}

// render the details of one fish in homePage-------------------------------------------
const weekFish = async (req,res) => {
    
    fish.find({time:{$gte: new Date(Date.now()-7*60*60*24*1000)}}, (err, fishes) => {
        fishes = fishes.map((fish) => {
            fish.img.data = fish.img.data.toString('base64');
            return fish.toObject();
        });
        res.render('homepage.hbs', {layout: 'main',fishes: fishes});
    }).sort({size: -1}).limit(1);

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
    weekFish,
    fishFilter
}