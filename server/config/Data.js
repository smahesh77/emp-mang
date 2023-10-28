const mongoose = require('mongoose')
const express = require('express');
const app = express()
require('dotenv').config()

// listen for request
const connection = mongoose.connect(process.env.URL)
   .then((result) => {
      console.log('Connected')
   })
   .catch((err) => console.log(err))

module.exports = mongoose