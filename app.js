const port = 3000;
const spdy = require('spdy');
const express = require('express');
const path = require('path');
const fs = require('mz/fs')

const app = express();

app.get('*', (req, res) => {

    // Read in the file
    fs.readFile('home.html','utf8')
      .then(file => {
        res.writeHead(200, { 'Content-Length': 42 });
        res.end(file);
      });

      // Does the browser support push?
      if (res.push){
          res.push('/js/randomNumber.js', {
              req: {'accept': '**/*'},
              res: {'content-type': 'application/javascript'}
          }).end();

          res.push('/js/squareRoot.js', {
              req: {'accept': '**/*'},
              res: {'content-type': 'application/javascript'}
          }).end();
      }
});


spdy
    .createServer({
        key: fs.readFileSync('./server.key'),
        cert: fs.readFileSync('./server.crt')
    }, app)
    .listen(8000, (err) => {
        if (err) {
            throw new Error(err);
        }
        console.log('Listening on port:  8000.');
    });
