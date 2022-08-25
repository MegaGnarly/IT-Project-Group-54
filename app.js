//requirements----------------------------------------------------
var express = require('express')
var ejsLayouts = require("express-ejs-layouts");
var app = express()


//set up ejs view engine------------------------------------------
app.use(ejsLayouts);
app.set("views","./views");
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");


//Routing --------------------------------------------------------
const appRouter = require('./router/appRouter') //app
app.use('/', appRouter);


//port------------------------------------------------------------
var port = process.env.PORT || '3000'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})