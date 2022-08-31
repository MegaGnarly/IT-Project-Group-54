//model for the fish----------------------------------------------
const mongoose = require('mongoose')

//I added a angler attribute cuz I think we might need to sort with respect to anglers too
var fishSchema = new mongoose.Schema({
    angler: String,
    species: {type: String, required:true},
    size: Number,
    weight: Number,
    img:
    {
        data: Buffer,
        contentType: String
    }
})

const fish = mongoose.model('fish', fishSchema)

module.exports = fish