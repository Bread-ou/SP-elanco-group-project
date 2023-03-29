// Route file used to gather all the past results and foward that to the front end
const express = require('express')
const router = express.Router()

router.get('/', (req, res)=> {
    var error ='';

    res.render('gallery', {errorMessage:error})
})

module.exports = router