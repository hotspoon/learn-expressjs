const express = require('express')
const app = express()


const mongoose = require('mongoose')
const env = require('dotenv/config')

app.use(express.json())

const userRoutes = require('./routes/user')
app.use('/api/', userRoutes)

const authRoutes = require('./routes/auth')
app.use('/api/auth/', authRoutes)

app.listen('3000', ()=>{
    console.log('Server is up and running!!!')
})

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }, (err)=>{
    if(err) return console.log(err.message)
    
    console.log('Database connected');
})