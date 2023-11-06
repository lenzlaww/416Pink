const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()
const PORT = process.env.PORT;
const app = express()

const mongoose = require('mongoose')

app.use(express.json());

const connectDB = require('./connectDB')

connectDB()

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})