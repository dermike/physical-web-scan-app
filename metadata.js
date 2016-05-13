'use strict';
let http = require('http');

module.exports = (urldata, cb) => {
  let urls = JSON.stringify({'objects': urldata}),
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': urls.length
    },
    options = {
      'host': 'service.physical-web.org',
      'port': 80,
      'path': '/resolve-scan',
      'method': 'POST',
      'headers': headers
    },
    urlOnly = () => {
      let data = JSON.parse(urls);
      for (let i in data.objects) {
        if (data.objects.hasOwnProperty(i)) {
          cb([data.objects[i].url, '', data.objects[i].url]);
        }
      }
    },
    req = http.request(options, res => {
      res.setEncoding('utf-8');
      let responseString = '';

      res.on('data', data => {
        responseString += data;
      });

      res.on('end', () => {
        try {
          let response = JSON.parse(responseString);
          for (let i in response.metadata) {
            if (response.metadata.hasOwnProperty(i)) {
              let data = response.metadata[i];
              cb([data.title, data.description, data.displayUrl]);
            }
          }
        } catch (e) {
          console.log(e);
          urlOnly();
        }
      });
    });

  req.on('error', e => {
    console.log(e);
    urlOnly();
  });

  req.write(urls);
  req.end();
};
