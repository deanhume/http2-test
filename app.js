const port = 3000;
const spdy = require('spdy');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.get('*', (req, res) => {
    res.writeHead(200, { 'Content-Length': 42 });
    res.end('<h1>Hi</h1><script src="main.js"></script><script src="main2.js"></script><script src="main3.js"></script><script src="main4.js"></script>');


      if (res.push){

        var stream = res.push(['/main.js', '/main2.js'], {
                req: {'accept': '**/*'},
                res: {'content-type': 'application/javascript'}
            });


                var stream3 = res.push('/main3.js', {
                        req: {'accept': '**/*'},
                        res: {'content-type': 'application/javascript'}
                    });
                    var stream4 = res.push('/main4.js', {
                            req: {'accept': '**/*'},
                            res: {'content-type': 'application/javascript'}
                        });

        stream.on('error', function() {
           console.error(err);
         });

         stream.end();

          stream3.on('error', function() {
             console.error(err);
           });

           stream3.end();
           stream4.on('error', function() {
              console.error(err);
            });

            stream4.end();
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
