var app = require('app'),
    BrowserWindow = require('browser-window'),
    Menu = require('menu'),
    noble = require('noble'),
    metadata = require('./metadata.js'),
    urldecode = require('./urldecode.js'),
    mainWindow = null,
    counter = 0;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

noble.on('scanStart', function() {
  console.log('Scan started...');
  mainWindow.webContents.send('status', 'Scanning for Physical Web beacons', true);
  counter = 0;
  app.dock.setBadge('');
});

noble.on('scanStop', function() {
  console.log('Scan stopped...');
  mainWindow.webContents.send('status', 'Scanning stopped. Press CMD + S to restart scan.');
});
    
noble.on('discover', function(peripheral) {
  var serviceData = peripheral.advertisement.serviceData;
  if (serviceData && serviceData.length) {
    var objects = [];
    for (var i in serviceData) {
      
      // check if Eddystone-URL 
      if (serviceData[i].data.toString('hex').substr(0,2) === '10') {
        var url = urldecode(serviceData[i].data.toString('hex'));
        objects.push({url: url});
      }
    }
    if (objects.length) {
      metadata(objects, function(message) {
        mainWindow.webContents.send('url', message);
        if (!mainWindow.isFocused()) {
          counter ++;
          app.dock.setBadge('' + counter + '');
        }
      });
    }
  }
});

app.on('ready', function() {
  
  var menuTemplate = [
    {
      label: 'Physical Web Scan',
      submenu: [
        {
          label: 'Scan for beacons',
          accelerator: 'Command+S',
          click: function() {
            if (noble.state === 'poweredOn') {
              noble.startScanning(['feaa']);
            } else {
              mainWindow.webContents.send('status', 'Bluetooth not ready or turned on. Press CMD + S to retry.');
            }
          }
        },
        {
          label: 'Stop scanning',
          accelerator: 'Command+T',
          click: function() {
            noble.stopScanning();
          }
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        }
      ]
    }
  ];
  
  menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow = new BrowserWindow({width: 480, height: 600});

  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  
  mainWindow.webContents.on('did-finish-load', function() {
    console.log(noble.state);
    if (noble.state === 'poweredOn') {
      noble.startScanning(['feaa']);
    }

  });
  
});

app.on('browser-window-focus', function() {
  counter = 0;
  app.dock.setBadge('');
});