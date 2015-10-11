var http = require('http');

module.exports = function(url, cb) {
  var urls = JSON.stringify({objects: url}),
      headers = {
        'Content-Type': 'application/json',
        'Content-Length': urls.length
      },
      options = {
        host: 'url-caster.appspot.com',
        port: 80,
        path: '/resolve-scan',
        method: 'POST',
        headers: headers
  };
  
  function urlOnly() {
    var data = JSON.parse(urls);
    for (var i in data.objects) {
      cb([data.objects[i].url, '', data.objects[i].url]);
    }
  }

  var req = http.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      try {
        var response = JSON.parse(responseString);
        for (var i in response.metadata) {
          var data = response.metadata[i];
          cb([data.title, data.description, data.displayUrl]);
        }
      }
      catch(e) {
        console.log(e);
        urlOnly();      
      }
    });
  });

  req.on('error', function(e) {
    console.log(e);
    urlOnly();   
  });

  req.write(urls);
  req.end();
}