const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const port = 3000
const data_root = "/Users/faro/Downloads/MUSDB18-7-WAV/train"

app.use('/static', express.static(data_root))
// Just the asset.
app.use('/player/*', (req, res, next) => {
    req.url = path.basename(req.originalUrl);
    express.static(__dirname + '/dist')(req, res, next);
  });

app.get("/tracks", (req, res, next) => {
    const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
    
    res.json(getDirectories(data_root))
})

app.get('/sources', function (req, res) {  
    res.json(req.query)  
})  

app.get("/track/:track", (req, res, next) => {
    const track_root = path.join(data_root, req.params.track)
    const getAudios = source =>
      fs.readdirSync(source)
        .filter((dirent) => dirent.match(/\.(wav|m4a|mp4|mp3)(?:\?.*|)$/i))
        .map(dirent => path.join("/static", req.params.track, dirent))
    
    var filenames = getAudios(track_root)
    var json = []
    for (const [index, p] of filenames.entries()) {
        json.push({
            "name": path.parse(p).name,
            "path": p
        })
    }
    res.json(json)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

