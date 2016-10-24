const spdy = require('spdy');
const express = require('express');
const fs = require('mz/fs');

const app = express();

app.use(express.static('public'));

app.get('/home', (req, res) => {
    fs.readFile('home.html')
      .then(file => {
        res.writeHead(200);
        res.end(file);
      }).catch(error => res.status(500).send(error.toString()));
});

spdy.createServer({
        key: fs.readFileSync('./server.key'),
        cert: fs.readFileSync('./server.crt')
    }, app)
    .listen(8000, (err) => {
        if (err) {
            throw new Error(err);
        }
        console.log('Listening on port:  8000.');
    });
