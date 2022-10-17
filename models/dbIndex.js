//require the mongoose module----------------------------
var mongoose = require('mongoose')
require('dotenv/config');

/**
 * this file is used to connect to our database
 */
const mongooseClient = mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'itproject'
})

module.exports = mongooseClient

require('./fish')