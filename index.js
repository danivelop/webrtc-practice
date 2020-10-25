const express = require('express')
const http = require('http')
const fs = require('fs')
const path = require('path')

const app  = express()
const port = 8080

app.use(express.static(path.join(__dirname, 'public')))

http.createServer(app).listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})