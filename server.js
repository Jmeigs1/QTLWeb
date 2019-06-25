const express = require('express')
const os = require('os')

const path = require('path')

const app = express()


const publicDir = path.resolve(__dirname, 'dist')
app.use(express.static(publicDir))
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }))
app.get('*', (request, response) => {
  response.sendFile(path.join(publicDir,'index.html'))
})

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`))