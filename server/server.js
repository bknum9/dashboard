require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const testingRoutes = require('./routes/testing')
const cors = require('cors')
const app = express()

//middleware
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api', testingRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
.then(() =>{
        //listen for requests
        app.listen(process.env.PORT, () => {
        console.log('connected to DB and listening on port', process.env.PORT)
})
})
.catch((error) =>{
    console.log(error)
})



