// Requirments to run the sever.
const express = require('express')
const app = express()
const multer = require('multer')
const path = require ('path')
const PORT = process.env.PORT || 3000

// Image storage method.
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})

// Setting up the view engine.
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')


app.get('/upload', (req, res)=> {
    res.render('index')
})

app.post('/upload', upload.single('image'), (req,res)=>{
    res.send("Image Uploaded")
})

app.listen(PORT, ()=>{
    console.log("The server is running on port number: "+PORT)
})