import axios from 'axios';

// console.log('hello world');
// chrome.identity.getAuthToken({
//   'interactive': true
// }, (data) => console.log(data));
chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
  if (request.action === 'GET') {
    // alert(request.url);
    axios.get(request.url, {
      headers: {
        credentials: request.token
      }
    })
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
    axios.put(request.url, {}, {
      headers: {
        credentials: request.token
      }
    })
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
    axios.post(request.url, request.data, {
      headers: {
        credentials: request.token
      }
    })
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

  if (request.authenticate) {
    //////////////////////
    ////////AUTH//////////
    //////////////////////
    var manifest = chrome.runtime.getManifest();

    var clientId = encodeURIComponent(manifest.oauth2.client_id);
    var scopes = encodeURIComponent(manifest.oauth2.scopes.join(' '));
    var redirectUri = encodeURIComponent('urn:ietf:wg:oauth:2.0:oob:auto');

    var url = 'https://accounts.google.com/o/oauth2/auth' + 
              '?client_id=' + clientId + 
              '&response_type=id_token' + 
              '&access_type=offline' + 
              '&redirect_uri=' + redirectUri + 
              '&scope=' + scopes;

    var RESULT_PREFIX = ['Success', 'Denied', 'Error'];
    chrome.tabs.create({'url': 'about:blank'}, function(authenticationTab) {
      chrome.tabs.onUpdated.addListener(function googleAuthorizationHook(tabId, changeInfo, tab) {
        if (tabId === authenticationTab.id) {
          var titleParts = tab.title.split(' ', 2);

          var result = titleParts[0];
          if (titleParts.length === 2 && RESULT_PREFIX.indexOf(result) >= 0) {
            chrome.tabs.onUpdated.removeListener(googleAuthorizationHook);
            chrome.tabs.query({url: '*://mail.google.com/*'}, (tabs) => {
              chrome.tabs.update(tabs[0].id, {active: true});
              chrome.tabs.remove(tabId);
            });

            var response = titleParts[1];
            switch (result) {
              case 'Success':
                // Example: id_token=<YOUR_BELOVED_ID_TOKEN>&authuser=0&hd=<SOME.DOMAIN.PL>&session_state=<SESSION_SATE>&prompt=<PROMPT>
                var token = response.split('&')[0].split('=')[1];
                // console.log(token);
                sendResponse({
                  token: token
                });
              break;
              case 'Denied':
                // Example: error_subtype=access_denied&error=immediate_failed
                console.log(response);
              break;
              case 'Error':
                // Example: 400 (OAuth2 Error)!!1
                console.log(response);
            break;
            }
          }
        }
      });

      chrome.tabs.update(authenticationTab.id, {'url': url});
    });

    return true;
  }
});

// chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
//     var url = tabs[0].url;
// });
