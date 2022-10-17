/**Authors:              StudentId:
 *        :Yu HE (Jack)           :1058035
 *        :David Liu              :1182979
 *        :Victor Lok             :1172126
 *        :Bernhard Danielsen     :1106804
 * 
 * This program is wrote for the FishCrate app, which is an app made for 
 * anglers to record and to share their catches.
 */

/**
 * this file is the central app of Fish Crate. It recieves front end
 * requests and redirect these requests to related Router.
 */

// imported packages-----------------------------------------------------
const PORT = 8080;
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const session = require('express-session')
const flash = require('express-flash')
const passport = require('./passport.js')

const app = express();



//set up view engine------------------------------------------
app.engine('hbs', exphbs.engine({
    defaultlayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

// Flash messages for failed logins, and (possibly) other success/error messages
app.use(flash())

app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'demo', // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: app.get('env') === 'production',
            maxAge: 3600000
        },
    })
)
if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
}

app.use(passport.authenticate('session'))


// Load authentication router
const authRouter = require('./routes/authRouter');
app.use(authRouter)

// Define where static assets live
app.use(express.static('public'))

// Used to expose body section for POST method
app.use(bodyParser.urlencoded({ extended: false }));

const appRouter = require('./routes/appRouter')   

app.use('/', appRouter)

app.get('*', appRouter)

app.listen(process.env.PORT || PORT, () => {
    console.log('\n\Fish Crate is running!')
})

module.exports = app;