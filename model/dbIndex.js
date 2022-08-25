//require the mongoose module----------------------------
var mongoose = require('mongoose')
require('dotenv/config');

const mongooseClient = mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'itproject'
})

module.exports = mongooseClient

require('./fish')