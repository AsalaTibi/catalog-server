
const express = require('express')
const catalogRoute =require("./routes/catalog")
const bodyParser = require('body-parser')

const port =process.env.port || 5000

const app =express()

app.use(bodyParser.json())
app.use(express.json())
app.use(catalogRoute)


app.listen(port ,()=>{console.log('catalog server listen on port '+ port)})