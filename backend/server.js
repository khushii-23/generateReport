const express = require('express');
require('dotenv').config()

const mongoose = require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.MORGO_URI).then(() =>{
    console.log("Connected!!")
})
.catch((error)=>{
    console.log("Error",error)
})

app.listen(process.env.PORT,() =>(
    console.log(`Server Started at ${process.env.PORT}`)
))

const reportRouter = require('../backend/routes/reportRoutes')
app.use('/api',reportRouter)