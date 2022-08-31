//requires fish and user model----------------------------------
var fish = require('../model/fish');
var User = require('../model/user');

//render the view fish page----------------------------
const viewFish = async (req,res) => {
    fish.find((err, images) => {
        images = images.map((image) => {
            image.img.data = image.img.data.toString('base64');
            return image.toObject();
        });
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
    registerUser
}