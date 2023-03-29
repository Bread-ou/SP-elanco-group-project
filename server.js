// Requirments to run the sever.
const express = require('express')
const app = express()
const uploadRouter = require('./routes/upload')
const galleryRouter = require('./routes/gallery')
const connectDB = require('./config/dbConn')
const mongoose = require ('mongoose')
mongoose.set('strictQuery', true)
const PORT = process.env.PORT || 3000


//Connect TO Mongo DB
connectDB()
mongoose.connection.once('open', ()=> {
    console.log("Connected to MongoDB")
});

// Setting up the view engine.
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use('/images', express.static('images'))
app.use('/processedImages', express.static('processedImages'))


// Set up a redirect from the root URL to the upload page instead.
app.get('/', (req, res) => {
    res.redirect('/upload')
})

// Use the galleryRouter for requests to retrieve
app.use('/gallery', galleryRouter);

// Use the uploadRouter for requests to /upload
app.use('/upload', uploadRouter)

app.use("/views",express.static(__dirname + "/views"))

app.listen(PORT, ()=>{
    console.log("The server is running on port number: "+PORT)
    
})


