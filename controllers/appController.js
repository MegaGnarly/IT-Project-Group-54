//requires fish model----------------------------------
var fish = require('../models/fish');

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

//exports----------------------------------------------
module.exports = {
    viewFish
}