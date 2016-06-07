'use strict';
{
  const {ipcRenderer} = require('electron');
  const {shell} = require('electron');
  const results = document.getElementById('results');
  const status = document.getElementById('status');

  function go(link) {
    shell.openExternal(link);
  }

  ipcRenderer.on('status', (event, message, clear) => {
    status.innerHTML = message;
    if (clear) {
      results.innerHTML = '';
      document.body.classList.add('scanning');
    } else {
      document.body.classList.remove('scanning');
    }
  });

  ipcRenderer.on('url', (event, message) => {
    let button = document.createElement('button'),
      desc = document.createElement('p');

    button.innerHTML = message[0];
    button.onclick = () => { go(message[2]); };

    desc.innerHTML = '<a href="#">' + message[2] + '</a>' + message[1];
    desc.onclick = () => { go(message[2]); };

    results.insertBefore(desc, results.firstChild);
    results.insertBefore(button, results.firstChild);
  });
}
