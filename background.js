import axios from 'axios';

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
  if (request.action === 'GET') {
    // alert(request.url);
    axios.get(request.url)
    .then(function(data) {
      sendResponse({
        data: data.data
      });
    })
    .catch(function(err) {
      sendResponse({
        err: err
      });
    });

    return true;
  }

  if (request.action === 'PUT') {
    axios.put(request.url)
    .then(function(data) {
      sendResponse({
        data: data.data
      });
    })
    .catch(function(err) {
      sendResponse({
        err: err
      });
    });

    return true;
  }

  if (request.action === 'POST') {
    axios.post(request.url, request.data)
    .then(function(data) {
      sendResponse({
        data: data.data
      });
    })
    .catch(function(err) {
      sendResponse({
        err: err
      });
    });

    return true;
  }
});

// chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
//     var url = tabs[0].url;
// });