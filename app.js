const spdy = require('spdy');
const express = require('express');
const fs = require('mz/fs');

const app = express();

app.use(express.static('public'));

app.get('/home', (req, res) => {
    Promise.all([
      fs.readFile('home.html'),
      fs.readFile('public/js/squareRoot.js'),
      fs.readFile('public/js/randomNumber.js'),
    ]).then(files => {

      // Does the browser support push?
      if (res.push){
          // The JS file
          var squareRootStream = res.push('/js/squareRoot.js', {
              req: {'accept': '**/*'},
              res: {'content-type': 'application/javascript'}
          });

          squareRootStream.on('error', err => {
            console.log(err);
          });

          squareRootStream.end(files[1]);

          // The Image
          var randomNumberStream = res.push('/js/randomNumber.js', {
              req: {'accept': '**/*'},
              res: {'content-type': 'application/javascript'}
          });

          randomNumberStream.on('error', err => {
            console.log(err);
          });

          randomNumberStream.end(files[2]);
      }

      res.writeHead(200);
      res.end(files[0]);
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
