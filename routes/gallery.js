// Route file used to gather all the past results and foward that to the front end
const mongoose = require ('mongoose')
const db = require('../database/DB')
const express = require('express')
const router = express.Router()

const Image = mongoose.model('Image', db.imageSchema, "Images_Data")

router.get('/images', async (req, res) => {

    try {
      const images = await Image.find()

      res.render('images', { images })
    } catch (err) {
      console.error(err)
      res.status(500).send('Server Error')
    }
})

module.exports = router