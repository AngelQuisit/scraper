const express = require('express');
const app = express();
const cors = require('cors')
const serverless = require('serverless-http');

const port = process.env.PORT || 8080;

const getRouter = require('./src/routes/getRoutes')

app.use(cors())
app.use(express.json())

app.use("/routes", getRouter)

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})

module.exports.handler = serverless(app)