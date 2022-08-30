const PORT = 8080;
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');

const app = express();

//set up view engine------------------------------------------
app.engine('hbs', exphbs.engine({
    defaultlayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

// Define where static assets live
app.use(express.static('public'))

// Used to expose body section for POST method
app.use(bodyParser.urlencoded({ extended: false }));

const appRouter = require('./routes/appRouter')   

app.use('/', appRouter)

app.listen(process.env.PORT || PORT, () => {
    console.log('\n\nAppname is running!')
})
