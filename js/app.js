(function() {
  var ipc = require('ipc'),
      shell = require('shell'),
      results = document.getElementById('results');

  ipc.on('status', function(message, clear) {
    var status = document.getElementById('status') || document.createElement('div');
    if (!status.id) {
      status.classList.add('vertical-center');
      status.id = 'status';
      document.body.appendChild(status);
    }
    status.innerHTML = message;
    
    if (clear) {
      results.innerHTML = '';
    }
    
  });

  ipc.on('url', function(message) {
    var button = document.createElement('button'),
        desc = document.createElement('p'),
        status = document.getElementById('status');
    
    if (status.id) {
      status.parentNode.removeChild(status);
    }
    
    button.classList.add('button', 'expand');
    button.innerHTML = message[0];
    button.onclick = function() { go(message[2]); };
    
    desc.innerHTML = message[1] + '<a href="#">' + message[2] + '</a>';
    desc.onclick = function() { go(message[2]); };
    
    results.insertBefore(desc, results.firstChild);
    results.insertBefore(button, results.firstChild);
  });

  function go(link) {
    shell.openExternal(link);
  }

  function reset() {
    var status = document.getElementById('status') || document.createElement('div');
    results.innerHTML = '';
    
    if (!status.id) {
      status.classList.add('vertical-center');
      status.id = 'status';
      status.innerHTML = 'Waiting to scan... Press CMD + S to start.';
      document.body.appendChild(status);
    }
  };

  reset();
  
})();