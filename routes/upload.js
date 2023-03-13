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
    },
    array: true

})

// Get the index page to render.
router.get('/', (req, res)=> {
    res.render('index')
})

// Post method used to upload image to the server, send and receive labels from the API, and forward that to the front end.
router.post('/', upload.array('images', 10), async (req,res)=>{
    // If there are files uploaded
    if (req.files && req.files.length > 0) {
        const labelsList = []
        const imageUrls = []

        // Loop through all uploaded files
        for(let i=0; i<req.files.length; i++) {
            const file = req.files[i];
            // Send image and return the results from the API.
            const [result] = await client.labelDetection(file.path)
            const labels = result.labelAnnotations.map(label => {
                return { description: label.description, score: label.score }
            })
            // Sort the labels in order of highest confidence.
            let sortedLabels = labels.sort((a, b) => b.score - a.score)
            const imageUrl = '/images/' + path.basename(file.path)

            // TODO: Write a function to iterate through labels map and compare and remove unnecessary labels.
            const newLabels = labelChecker.filterLabels(sortedLabels)
            sortedLabels = labelChecker.seperateLabels(newLabels, sortedLabels)

            // Save both types of labels in separate JSON files. 
            fileSave.saveLabels(sortedLabels, imageUrl, 'unfilteredLabels.json')
            fileSave.saveLabels(newLabels, imageUrl, 'filteredLabels.json')

            labelsList.push({ newLabels, sortedLabels })
            imageUrls.push(imageUrl)
        }

        // Render labels.ejs file and pass on the sorted labels and image URLs.
        res.render('labels', {labelsList, imageUrls})
    } else {
        // Error handling when no images are uploaded
        res.status(400).send("Please upload at least one valid image")
    }
})


module.exports = router