// Requirments to run the sever.
const express = require('express')
const app = express()
const multer = require('multer')
const path = require ('path')
const PORT = process.env.PORT || 3000

// Google cloud vision setup.
const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient({
    keyFilename: './Key.json'
  })

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
app.use('/images', express.static('images'))


app.get('/upload', (req, res)=> {
    res.render('index')
})

app.post('/upload', upload.single('image'), async (req,res)=>{
    const [result] = await client.labelDetection(req.file.path)
    const labels = result.labelAnnotations.map(label => {
    return { description: label.description, score: label.score }
  })
  const imageUrl = '/images/' + path.basename(req.file.path)
  res.render('labels', { labels, imageUrl });
})

app.listen(PORT, ()=>{
    console.log("The server is running on port number: "+PORT)
})