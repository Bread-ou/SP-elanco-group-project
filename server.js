// Requirments to run the sever.
const express = require('express')
const app = express()
const uploadRouter = require('./routes/upload')
const PORT = process.env.PORT || 3000


// Setting up the view engine.
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use('/images', express.static('images'))



// Set up a redirect from the root URL to the upload page instead.
app.get('/', (req, res) => {
    res.redirect('/upload')
})

// Use the uploadRouter for requests to /upload
app.use('/upload', uploadRouter)


app.listen(PORT, ()=>{
    console.log("The server is running on port number: "+PORT)
})