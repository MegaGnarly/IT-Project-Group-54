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

app.get('/', (req, res) => {
    res.render('homepage.hbs')
})

app.listen(process.env.PORT || PORT, () => {
    console.log('\n\nAppname is running!')
})
