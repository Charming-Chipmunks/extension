import axios from 'axios';

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
  if (request.action === 'GET') {
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
});

// chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
//     var url = tabs[0].url;
// });