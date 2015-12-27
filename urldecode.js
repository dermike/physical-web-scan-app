'use strict';
module.exports = serviceData => {
  let buf = new Buffer(serviceData, 'hex'),
    url = '';

  for (let i = 2; i < buf.length; i += 1) {
    // check for URI prefix
    if (i === 2 && buf[i] >= 0 && buf[i] <= 3) {
      switch (buf[i]) {
      case 0:
        url += 'http://www.';
        break;
      case 1:
        url += 'https://www.';
        break;
      case 2:
        url += 'http://';
        break;
      case 3:
        url += 'https://';
        break;
      default:
      }
    } else {
      // check for HTTP URL Scheme
      if (buf[i] >= 0 && buf[i] <= 32) {
        switch (buf[i]) {
        case 0:
          url += '.com/';
          break;
        case 1:
          url += '.org/';
          break;
        case 2:
          url += '.edu/';
          break;
        case 3:
          url += '.net/';
          break;
        case 4:
          url += '.info/';
          break;
        case 5:
          url += '.biz/';
          break;
        case 6:
          url += '.gov/';
          break;
        case 7:
          url += '.com';
          break;
        case 8:
          url += '.org';
          break;
        case 9:
          url += '.edu';
          break;
        case 10:
          url += '.net';
          break;
        case 11:
          url += '.info';
          break;
        case 12:
          url += '.biz';
          break;
        case 13:
          url += '.gov';
          break;
        default:
        }
      } else {
        url += String.fromCharCode(buf[i]);
      }
    }
  }
  return url;
};
