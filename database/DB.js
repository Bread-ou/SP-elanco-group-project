
// MonogoDB setup (mongoose)

const dotenv = require('dotenv')
dotenv.config()
const mongoose = require ('mongoose')
mongoose.set('strictQuery', true)

// imageSchema for the images and labels

const imageSchema = new mongoose.Schema({
    data: {
        type: Buffer,
        required: true
      },
    //    Processed: {
    //     type: Buffer,
    //     required: true
    //   },
    //   Animals: {
    //     type: Number,
    //     required: true
    //   },
      FilteredLabels: {
        type: [{ description: String, score: Number }],
        required: true
      },
      sorted: {
        type: [{ description: String, score: Number }],
        required: true
      }
  })

    //indexing
imageSchema.index({ FilteredLabels: 1 })
imageSchema.index({ sorted: 1 })
imageSchema.index({ Animals: 1 })



module.exports = {
    imageSchema,
    
}