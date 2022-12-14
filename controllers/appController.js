/**
 * this file is the core functionalities of the app,
 * it mainly deals with database searching and various types of sorting.
 */
//requires fish and user model----------------------------------
const sessionStorage = require('sessionstorage')
const authRouter = require('../routes/authRouter')
var fish = require('../models/fish');
var User = require('../models/user');

// viewing fish page--------------------------------------------------------------
/**
 * this function finds all caught by a specific user
 * ny filtering our fish database with the username
 */
const viewFish = async (req,res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    var user = true;
    var found = false;
    fish.find({angler: sessionStorage.getItem('username')}, (err, fishes) => {
        if(fishes.length>0){
            found = true;
        }
        fishes = fishes.map((fish) => {
            fish.img.data = fish.img.data.toString('base64');
            return fish.toObject();
        });
        console.log(sessionStorage.getItem('username'))
        res.render('viewFish.hbs', {layout: "mainLoggedIn.hbs", fishes: fishes, user: user, found: found});
    })
}

// filter function in viewFish page-------------------------------------------------------
/**
 * this function provides both filtering and sorting in viewFish page
 * it gets both sorting attribute and filtering attributes from that
 * page, and apply them to our database
 */
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
    var regex = { $regex: req.body.name.trim(), $options: "i" };
    if (searchAttribute == 'default'){
        fish.find({angler: sessionStorage.getItem('username')},
         (err, fishes)=>action(fishes)).sort(sort);
    }else if (searchAttribute == 'species'){
        fish.find({angler: sessionStorage.getItem('username'), species: regex},
         (err, fishes)=>action(fishes)).sort(sort);
    }else if (searchAttribute == 'weather'){
        fish.find({angler: sessionStorage.getItem('username'), weather: regex},
         (err, fishes)=>action(fishes)).sort(sort);
    }else if (searchAttribute == 'location'){
        fish.find({angler: sessionStorage.getItem('username'), location: regex},
         (err, fishes)=>action(fishes)).sort(sort);
    }else if (searchAttribute == 'mates'){
        fish.find({angler: sessionStorage.getItem('username'), mates: regex},
         (err, fishes)=>action(fishes)).sort(sort);
    }else if (searchAttribute == 'period'){
        fish.find({angler: sessionStorage.getItem('username'), period: regex},
         (err, fishes)=>action(fishes)).sort(sort);
    }

    function action(fishes){
        var found = false;
        if(fishes.length>0){
            found = true;
        }
        fishes = fishes.map((fish) => {
            fish.img.data = fish.img.data.toString('base64');
            return fish.toObject();
        });
        res.render('viewFish.hbs', {layout: "mainLoggedIn.hbs", fishes: fishes, user: sessionStorage.getItem('username'), found: found});
        searchAttribute = null;
    }
    
};

// render the details of one fish-------------------------------------------
/**
 * this function finds a specific fish record by accepting a given
 * fish id. to avoid conflict, we limit the result of find() to 1
 */
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
/**
 * this function simplily applys the deletOne() to a
 * given fish record according to it's id. remove that
 * record and redirect the user back to viewFish page
 */
const deleteFish = async (req,res) => {
    var info = {_id: req.params._id};
    fish.deleteOne(info, function(err, obj) {if (err) throw err;});
    return res.redirect("/viewFish")
}

// update details of one fish-------------------------------------------------
/**
 * this function updates recorded data of a fish record in database,
 * by accepting updated data and id of that fish
 */
const updateFish = async (req,res) => {

    var info = {_id: req.params._id};

    var newvalues = { $set: {species: req.body.name,
        period: req.body.period,
        size: req.body.size,
        weight: req.body.weight,
        weather: req.body.weather,
        location: req.body.location,
        mates: req.body.mates} };
    
    fish.updateOne(info, newvalues, function(err, obj) {if (err) throw err;});
    
    return res.redirect("/viewFish")
}

// create a simpler string to store date----------------------------------------
/**
 * we originally store date details with accurate to seconds,
 * but it's hard to read, this function turns it to a more 
 * readable string to store and to be shown
 */
const getDateString = function (date = new Date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    newDate = day + "/" + month + "/" + year;
    return newDate;
};

// render the details of one fish in homePage-------------------------------------------
/**
 * this function filter our entire fish database and finds out
 * the biggest fish by sorting with size and limit the result to 1
 */
const starFish = async (req,res) => {

    today = getDateString();

    var todayTotal = await fish.find({displayDate:today}).count();

    var total = await fish.find().count();
    
    fish.find({time:{$gte: new Date(Date.now()-30*60*60*24*1000)}}, (err, fishes) => {
        fishes = fishes.map((fish) => {
            fish.img.data = fish.img.data.toString('base64');
            return fish.toObject();
        });
        var result = {todayTotal: todayTotal, total: total, fishes: fishes};
        res.render('homepage.hbs', {layout: 'main',result: result});
    }).sort({size: -1}).limit(1);

}

// register user --------------------------------------
/**
 * this function allows our user to create a new account and save it
 * to our user database
 */
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

// user homepage------------------------------------------------
/**
 * this function is for the angler career block on the userhomepage
 * it finds the biggest fish in the user's fish record and counts
 * various types of fish attributes and pack them together in an
 * object, then send it to frontend
 */
const user = async (req,res) => {
    if (!req.isAuthenticated()){
        return res.redirect('login')
    }
    var rec = await fish.find({angler: sessionStorage.getItem('username')});

    var priList = new Array();
    var locList = new Array();
    var speList = new Array();
    var matList = new Array();
    var weaList = new Array();

    var totalWeight = 0
    for (key in rec) { 
        totalWeight+=rec[key].weight;
        if(rec[key].location!=undefined&&rec[key].location!=''){
            var loc = rec[key].location.trim();
            locList.push(loc);
        }

        if(rec[key].period!=undefined&&rec[key].period!=''){
            var pri = rec[key].period;
            priList.push(pri);
        }

        if(rec[key].species!=undefined&&rec[key].species!=''){
            var spe = rec[key].species.trim();
            speList.push(spe);
        }

        if(rec[key].mates!=undefined&&rec[key].mates!=''){
            var mat = rec[key].mates.trim();
            matList.push(mat);
        }

        if(rec[key].weather!=undefined&&rec[key].weather!=''){
            var wea = rec[key].weather;
            weaList.push(wea);
        }
    
    }

    var maxPri = null;
    var maxPriNum = 0;
    for (key in priList){
        var regex = { $regex: priList[key], $options: "i" };
        var n = await fish.find({angler: sessionStorage.getItem('username'), period: regex}).count();
        if (n>=maxPriNum){
            maxPriNum = n;
            maxPri = priList[key];
        }
    }

    var maxLoc = null;
    var maxLocNum = 0;
    for (key in locList){
        var regex = { $regex: locList[key], $options: "i" };
        var n = await fish.find({angler: sessionStorage.getItem('username'), location: regex}).count();
        if (n>=maxLocNum){
            maxLocNum = n;
            maxLoc = locList[key];
        }
    }

    var maxSpe = null;
    var maxSpeNum = 0;
    for (key in speList){
        var regex = { $regex: speList[key], $options: "i" };
        var n = await fish.find({angler: sessionStorage.getItem('username'), species: regex}).count();
        if (n>=maxSpeNum){
            maxSpeNum = n;
            maxSpe = speList[key];
        }
    }

    var maxMat = null;
    var maxMatNum = 0;
    for (key in matList){
        console.log(matList[key])
        var regex = { $regex: matList[key], $options: "i" };
        var n = await fish.find({angler: sessionStorage.getItem('username'), mates: regex}).count();
        if (n>=maxMatNum){
            maxMatNum = n;
            maxMat = matList[key];
        }
    }

    var maxWea = null;
    var maxWeaNum = 0;
    for (key in weaList){
        var regex = { $regex: weaList[key], $options: "i" };
        var n = await fish.find({angler: sessionStorage.getItem('username'), weather: regex}).count();
        if (n>=maxWeaNum){
            maxWeaNum = n;
            maxWea = weaList[key];
        }
    }

    var record = {record:{pri:maxPri, priNum:maxPriNum,
                loc: maxLoc, locNum: maxLocNum,
                spe: maxSpe, speNum: maxSpeNum,
                mat: maxMat, matNum: maxMatNum,
                wea: maxWea, weaNum: maxWeaNum,
                totWei: totalWeight}}

    fish.find({angler: sessionStorage.getItem('username'),time:{$gte: new Date(Date.now()-365*60*60*24*1000)}}, 
    (err, fishes) => {
        fishes = fishes.map((fish) => {
            fish.img.data = fish.img.data.toString('base64');
            return fish.toObject();
        });
        var result = {fishes: fishes, record: record};
        res.render('user_homepage.hbs', {layout: "mainLoggedIn.hbs",result: result, user: sessionStorage.getItem('username')});
    }).sort({size: -1}).limit(1);
}

// suggestion page---------------------------------------------------------------
/**
 * this function filters a given species fo fish in our database
 * and count the number of them with same location. pass the location
 * to frontend to give advice
 */
const recommend = async (req,res) => {
    var user = true;
    var regex1 = { $regex: req.body.name.trim(), $options: "i" };
    var rec = await fish.find({species: regex1});
    var locList = new Array();
    for (key in rec) { 
        if(rec[key].location!=undefined){
            var loc = rec[key].location;
            locList.push(loc);
        }
    }
    var maxLoc = null;
    var maxLocNum = 0;
    for (key in locList){
        var regex2 = { $regex: locList[key], $options: "i" };
        var n = await fish.find({species: regex1, location: regex2}).count();
        if (n>=maxLocNum){
            maxLocNum = n;
            maxLoc = locList[key];
        }
    }

    var result = {result:{loc: maxLoc, spe: req.body.name, num:maxLocNum}};
    return res.render('recommend', {layout: "mainLoggedIn.hbs",recommend: result, user});
}

//exports----------------------------------------------
module.exports = {
    viewFish,
    registerUser,
    fishDetails,
    deleteFish,
    updateFish,
    starFish,
    fishFilter,
    recommend,
    user,
    getDateString
}