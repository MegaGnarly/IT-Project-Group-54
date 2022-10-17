// imported packages----------------------------------------------
const mongoose = require('mongoose')

/**
 * this file is model of fish data stored in our database
 */
var fishSchema = new mongoose.Schema({
    angler: String,
    time: Date,
    displayDate: String,
    period: String,
    species: {type: String, required:true},
    size: Number,
    weight: Number,
    img:
    {
        data: Buffer,
        contentType: String
    },
    weather: String,
    location: String,
    mates: String
})

const fish = mongoose.model('fish', fishSchema)

module.exports = fish