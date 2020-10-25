const express = require('express')
const https = require('https')
const path = require('path')
const sslConfig = require('./private/ssl-config')

const app  = express()
const port = 8080

const options = {
  key: sslConfig.privateKey,
  cert: sslConfig.certificate,
  passphrase: 'qwer1234',
}

app.use(express.static(path.join(__dirname, 'public')))

https.createServer(options, app).listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})