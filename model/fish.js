const mongoose = require('mongoose')

var fishSchema = new mongoose.Schema({
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