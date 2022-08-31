const PORT = 8080;
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const sessionStorage = require('sessionstorage')
const session = require('express-session')
const passport = require('./passport.js')
const bcrypt = require('bcryptjs')

const app = express();



//set up view engine------------------------------------------
app.engine('hbs', exphbs.engine({
    defaultlayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

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
            maxAge: 600000
        },
    })
)

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

app.listen(process.env.PORT || PORT, () => {
    console.log('\n\nAppname is running!')
})
