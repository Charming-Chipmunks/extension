import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './components/Sidebar.js';
import Store from './components/Store.js';
import $ from 'jquery';

Date.prototype.toDateTime = function() {
  return this.toISOString().replace(/T/, ' ').slice(0, 19);
};

var insertWhenReady = function() {
  var emails = document.getElementsByClassName('Tm')[0];
  if (emails) {
    var div = document.createElement('div');
    div.id = 'ext';
    var spacer = document.createElement('spacer');
    spacer.id = 'spacer';
    emails.before(spacer);
    emails.before(div);
    ReactDOM.render(<Sidebar />, document.getElementById('ext'));
  } else {
    setTimeout(insertWhenReady, 100);
  }
};

insertWhenReady();

var detectLoad = function() {
  var loading = document.getElementById('loading');
  if (loading.getAttribute('style') !== 'display: none;') {
    setTimeout(detectLoad, 100);
  } else {
    var table = document.getElementsByClassName('zt')[0];
    if (table) {
      $(table).on('click', '.zA', function(e) {
        var detectEmailLoad = function() {
          var fromDiv = document.getElementsByClassName('gD')[0];
          if (fromDiv) {
            //EMAIL LOADED
            $('.lS').on('click', function(e) {
              Store.currentTab = 'tasks';
            });

            var timeSpans = document.getElementsByClassName('g3');
            Store.currentEmail = {
              senderEmail: fromDiv.getAttribute('email'),
              senderName: fromDiv.innerHTML,
              time: new Date(timeSpans[timeSpans.length - 1].title.replace(/at /, ' ')).toDateTime()
            };
            
            Store.currentContact = {};
            Store.currentJobTasks = [];
            chrome.runtime.sendMessage({
              action: 'GET',
              url: `${Store.server}/contacts/jobs/${encodeURIComponent(Store.currentEmail.senderEmail)}/${Store.userId}`
            }, function(res) {
              if (res.err) {
                Store.currentContact = {};
                console.log('error loading contact', res.err);
              } else {
                Store.currentContact = res.data;
                console.log('contact data', Store.currentContact);
              }
            });
            
            Store.currentTab = 'email';
          } else {
            setTimeout(detectEmailLoad, 100);
          }
        };
        detectEmailLoad();
      });
      Store.emailRowClickSet = true;
    } else {

    }
  }
};

detectLoad();

// var observer = new MutationObserver(function(mutations, observer) {
//   // fired when a mutation occurs
//   if (mutations.some(mutation => mutation.addedNodes.length && mutation.addedNodes[0].className && console.log(mutation.addedNodes[0].className))){ //&& mutation.addedNodes[0].className.indexOf('gD') > -1)) {
//     console.log(mutations, observer);
//   }
//   // ...
// });

// // define what element should be observed by the observer
// // and what types of mutations trigger the callback
// observer.observe(document, {
//   subtree: true,
//   attributes: true
//   //...
// });

setTimeout(() => {
  
}, 10000);