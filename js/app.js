'use strict';
{
  const { ipcRenderer, shell } = require('electron');
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
      desc = document.createElement('p'),
      [title, description, url] = message;

    button.innerHTML = title;
    button.onclick = () => { go(url); };

    desc.innerHTML = '<a href="#">' + url + '</a>' + description;
    desc.onclick = () => { go(url); };

    results.insertBefore(desc, results.firstChild);
    results.insertBefore(button, results.firstChild);
  });
}
