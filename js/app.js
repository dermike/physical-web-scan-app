(function pw() {
  var ipc = require('electron').ipcRenderer,
    shell = require('shell'),
    results = document.getElementById('results'),
    status = document.getElementById('status');

  function go(link) {
    shell.openExternal(link);
  }

  ipc.on('status', function ipcstatus(event, message, clear) {
    status.innerHTML = message;
    if (clear) {
      results.innerHTML = '';
    }
  });

  ipc.on('url', function ipcurl(event, message) {
    var button = document.createElement('button'),
      desc = document.createElement('p');

    button.innerHTML = message[0];
    button.onclick = function bclick() { go(message[2]); };

    desc.innerHTML = '<a href="#">' + message[2] + '</a>' + message[1];
    desc.onclick = function dclick() { go(message[2]); };

    results.insertBefore(desc, results.firstChild);
    results.insertBefore(button, results.firstChild);
  });
})();
