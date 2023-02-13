// Requirments to run the sever.
const express = require('express')
const app = express()

// Setting up the view engine.
app.set('view engine', 'ejs')
app.set('views', _dirname + '/views')


app.get('/', (req, res)=> {
    res.render('index')
})

app.listen(3000)