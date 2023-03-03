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

// Multer configuration
// TODO: handle the response properly.
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(('Please upload a valid image file!'))
        }
        cb(undefined, true)
    }

})

// Get the index page to render.
router.get('/', (req, res)=> {
    res.render('index')
})

// Post method used to upload image to the server, send and receive labels from the API, and forward that to the front end.
router.post('/', upload.single('image'), async (req,res)=>{

    // If the file matches the specifications made.
    if (req.file) {    
        // Send image and return the results from the API.
        const [result] = await client.labelDetection(req.file.path)
        const labels = result.labelAnnotations.map(label => {
        return { description: label.description, score: label.score }
        })
        // Sort the labels in order of highest confidence.
        
        // TODO: Check if it does that alredy.
        let sortedLabels = labels.sort((a, b) => b.score - a.score)
        const imageUrl = '/images/' + path.basename(req.file.path)

        // TODO: Write a function to iterate through labels map and compare and remove unnecessary labels.
        const newLabels = labelChecker.filterLabels(sortedLabels)
        sortedLabels = labelChecker.seperateLabels(newLabels, sortedLabels)

        // Save both types of labels in seperate json files. 
        fileSave.saveLabels(sortedLabels, imageUrl, 'unfilteredLabels.json')
        fileSave.saveLabels(newLabels, imageUrl, 'filteredLabels.json')


        // Render labels ejs file and pass on the sorted labels and image.
        res.render('labels', {newLabels, sortedLabels, imageUrl })
// Add proper error handling when the image is too large.
} else {
    // Error handling when not image, send responce.
    res.status(400).send("Please upload a valid image")
    //res.render('index')
    }
})

module.exports = router