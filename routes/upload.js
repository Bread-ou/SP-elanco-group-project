// Requirments needed to use this route file.
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require ('path')
const fileSave = require('../database/fileSave.js')
const labelChecker = require('../database/labelNameCheck')
// Google cloud vision setup.
const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient({
    keyFilename: './Key.json'
})

// Storage and multipart data handling.
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

// Get the index page to render.
router.get('/', (req, res)=> {
    res.render('index')
})

// Post method used to upload image to the server, send and receive labels from the API, and forward that to the front end.
router.post('/', upload.single('image'), async (req,res)=>{
    // Send image and return the results from the API.
    const [result] = await client.labelDetection(req.file.path)
    const labels = result.labelAnnotations.map(label => {
    return { description: label.description, score: label.score }
  })
  // Sort the labels in order of highest confidence.
  // TODO: Check if it does that alredy.
  let sortedLabels = labels.sort((a, b) => b.score - a.score)
  const imageUrl = '/images/' + path.basename(req.file.path)

  // Save raw images. 
  fileSave.saveRawLabels(sortedLabels, imageUrl)
  // TODO: Write a function to iterate through labels map and compare and remove unnecessary labels.
  const newLabels = labelChecker.filterLabels(sortedLabels)
  sortedLabels = labelChecker.seperateLabels(newLabels, sortedLabels)
  // Render labels ejs file and pass on the sorted labels and image.
  res.render('labels', {newLabels,sortedLabels, imageUrl });

})

module.exports = router