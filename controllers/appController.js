//requires fish model----------------------------------
var fish = require('../model/fish');

//render the view fish page----------------------------
const viewFish = async (req,res) => {
   const fishes = await fish.find().lean()
   return res.render('viewFishes', {items:fishes})
}

//exports----------------------------------------------
module.exports = {
    viewFish
}