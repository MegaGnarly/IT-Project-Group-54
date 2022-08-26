const PORT = 8080;
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const exphbs = require('express-handlebars');

app.engine('hbs', exphbs.engine({
    defaultlayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

const appRouter = require('./routes/appRouter')   

app.use('/', appRouter)

app.listen(process.env.PORT || PORT, () => {
    console.log('\n\nAppname is running!')
})
