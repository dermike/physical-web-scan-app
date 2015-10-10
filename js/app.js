(function() {
  var ipc = require('ipc'),
      shell = require('shell'),
      results = document.getElementById('results'),
      status = document.getElementById('status');

  ipc.on('status', function(message, clear) {
    status.innerHTML = message;
    status.classList.remove('hide');
    if (clear) {
      results.innerHTML = '';
    }
  });

  ipc.on('url', function(message) {
    var button = document.createElement('button'),
        desc = document.createElement('p');
    
    status.classList.add('hide');
    
    button.innerHTML = message[0];
    button.onclick = function() { go(message[2]); };
    
    desc.innerHTML = '<a href="#">' + message[2] + '</a>' + message[1];
    desc.onclick = function() { go(message[2]); };
    
    results.insertBefore(desc, results.firstChild);
    results.insertBefore(button, results.firstChild);
  });

  function go(link) {
    shell.openExternal(link);
  }
  
})();