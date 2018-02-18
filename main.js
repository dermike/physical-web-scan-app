/* eslint no-console: 0 */
'use strict';
const {app, BrowserWindow, Menu} = require('electron');
const noble = require('noble');
const metadata = require('./metadata.js');
const urldecode = require('./urldecode.js');
let mainWindow = null,
  counter = 0;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

noble.on('scanStart', () => {
  console.log('Scan started...');
  mainWindow.webContents.send('status', 'Scanning for Physical Web beacons. Press <span class="key" aria-label="command">&#8984;</span> + <span class="key">T</span> to stop.', true);
  counter = 0;
  app.dock.setBadge('');
});

noble.on('scanStop', () => {
  console.log('Scan stopped...');
  mainWindow.webContents.send('status', 'Scanning stopped. Press <span class="key" aria-label="command">&#8984;</span> + <span class="key">S</span> to restart scan.');
});

noble.on('discover', peripheral => {
  let serviceData = peripheral.advertisement.serviceData;
  if (serviceData && serviceData.length) {
    let objects = [];
    for (let i in serviceData) {
      // check if Eddystone-URL
      if (serviceData[i].data.toString('hex').substr(0, 2) === '10') {
        let url = urldecode(serviceData[i].data.toString('hex'));
        objects.push({'url': url});
      }
    }
    if (objects.length) {
      metadata(objects, Menu.getApplicationMenu().items[1].submenu.items[0].checked, message => {
        mainWindow.webContents.send('url', message);
        if (!mainWindow.isFocused()) {
          counter += 1;
          app.dock.setBadge('' + counter + '');
        }
      });
    }
  }
});

app.on('ready', () => {
  const menuTemplate = [
    {
      'label': 'Physical Web Scan',
      'submenu': [
        {
          'label': 'Scan for beacons',
          'accelerator': 'Command+S',
          'click': () => {
            if (noble.state === 'poweredOn') {
              noble.startScanning(['feaa']);
            } else {
              mainWindow.webContents.send('status', 'Bluetooth not ready or turned on. Press <span class="key" aria-label="command">&#8984;</span> + <span class="key">S</span> to retry.');
            }
          }
        },
        {
          'label': 'Stop scanning',
          'accelerator': 'Command+T',
          'click': () => {
            noble.stopScanning();
          }
        },
        {
          'label': 'Quit',
          'accelerator': 'Command+Q',
          'click': () => { app.quit(); }
        }
      ]
    },
    {
      'label': 'Developer settings',
      'submenu': [
        {
          'label': 'Bypass proxy service',
          'type': 'checkbox',
          'checked': false,
          'click': item => {
            if (item.checked && noble.state === 'poweredOn') {
              noble.startScanning(['feaa']);
            }
          }
        }
      ]
    }
  ];

  let menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow = new BrowserWindow({'width': 480, 'height': 600});

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log(noble.state);
    let startScan = () => {
      setTimeout(() => {
        if (noble.state === 'poweredOn') {
          noble.startScanning(['feaa']);
        } else {
          startScan();
        }
      }, 300);
    };
    startScan();
  });
});

app.on('browser-window-focus', () => {
  counter = 0;
  app.dock.setBadge('');
});
