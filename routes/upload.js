// Requirments needed to use this route file.
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require ('path')
const imgProcess = require('../database/imgProcess')
const labelChecker = require('../database/labelNameCheck')
const {getDescription} = require('../database/openAI')

// MonogoDB setup (mongoose)

const dotenv = require('dotenv')
dotenv.config();
const connectDB = require('../config/dbConn');
const mongoose = require ('mongoose')
mongoose.set('strictQuery', true);

// Google cloud vision setup.
const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient({
    keyFilename: './Key.json'
})

// imageSchema for the images and labels

const imageSchema = new mongoose.Schema({
    data: {
        type: Buffer,
        required: true
      },
       Processed: {
        type: Buffer,
        required: true
      },
      Animals: {
        type: Number,
        required: true
      },
      FilteredLabels: {
        type: [{ description: String, score: Number }],
        required: true
      },
      sorted: {
        type: [{ description: String, score: Number }],
        required: true
      }
  });

  //indexing
imageSchema.index({ FilteredLabels: 1 });
imageSchema.index({ sorted: 1 });
imageSchema.index({ Animals: 1 });

//Connect TO Mongo DB
connectDB();

const Image = mongoose.model('Image', imageSchema, "Images_Data");
const fs = require('fs');

mongoose.connection.once('open', ()=> {
    console.log("Connected to MongoDB")


});


// Storage and multipart data handling.

const storage = multer.memoryStorage();

// const storage = multer.diskStorage({
//     destination: (req, file, cb) =>{
//         cb(null, 'images')
//     },
//     filename: (req, file, cb) => {
//         console.log(file)
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// })

// Multer configuration
// TODO: handle the response properly.
const upload = multer({
    storage: storage,
    limits: {
        // 2 MB
        fileSize: (2 * 1024 * 1024)
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
    var error ='';

    res.render('index', {errorMessage:error});
})

// Post method used to upload image to the server, send and receive labels from the API, and forward that to the front end.
router.post('/', upload.array('images', 3), async (req,res)=>{
    // If there are files uploaded
    if (req.files && req.files.length > 0) {
        const labelsList = []
        const imageUrls = []
        const processedImageUrls = []
        const animalNum = []
        const animalTexts = []

        // Loop through the images, send API requests and store the responces.
        for(let i=0; i<req.files.length; i++) {
            const file = req.files[i];

            // save image in memory
            const buffer = file.buffer;

            // Send image and return the results from the API.
            const [result] = await client.labelDetection(buffer)
            const labels = result.labelAnnotations.map(label => {
                return { description: label.description, score: label.score }
            })
            // Get object detection results
            const [objectDetectionResult] = await client.objectLocalization(buffer)
            const objects = objectDetectionResult.localizedObjectAnnotations

            // Process and save processed IMG.
            const processedImageUrl = await imgProcess.processImg(objects, file)
            

            // Sort the labels in order of highest confidence.
            let sortedLabels = labels.sort((a, b) => b.score - a.score)
            //const imageUrl = '/images/' + path.basename(file.path)
            
            // TODO: LABEL SAVE METHOD MADE OBSOLETE, CHANGE IT TO FIT NEW FORMAT.

             // Count the number of animals in the objects array.
             let animalCount = 0
             objects.forEach(object => {
                 if (labelChecker.isAnimal(object)) {
                     animalCount++
                 }
             })

            // Filter the labels and store both lists in the labelsList.
            labelsList.push(labelChecker.filterLabels(sortedLabels)) 
            
            // If there is an animal name then get the description and store it in an array.
            if(labelsList[i].newLabels){
                console.log(labelsList[i].newLabels[0].description.toString())
                let animalText = getDescription(labelsList[i].newLabels[0].description.toString())
                animalTexts.push(animalText)
                console.log(animalText)
            }
            imageUrls.push(buffer)

            // Store the number of animals for each image.
            animalNum.push(animalCount)
            
            console.log(processedImageUrl)
            processedImageUrls.push(processedImageUrl)

         const image = new Image({ data: buffer, Processed: processedImageUrls[i], Animals: animalNum[i], FilteredLabels : labelsList[i].newLabels, sorted: labelsList[i].sortedLabels});
          image.save(function (err, image) {
          if (err)
          throw err
          console.log(image._id) // The ID of the inserted document

          })
        }

        
        
        // Render labels.ejs file and pass on the sorted labels and image URLs.
        res.render('labels', {labelsList, imageUrls, processedImageUrls, animalNum})
    } else {
        // Error handling when no images are uploaded
        res.status(400).send("Please upload at least one valid image")
      //  res.redirect('index2', { errorMessage : 'Please upload at least one valid image'  });
    }
});

router.get('/images', async (req, res) => {

    try {
      const images = await Image.find();

      res.render('images', { images });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
module.exports = router