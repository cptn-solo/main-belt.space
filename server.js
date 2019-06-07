const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
var app = express()
app.use(serveStatic(path.join(__dirname, 'dist')))
const port = process.env.PORT || 80
app.listen(port)

if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('dist'))
}
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})
