import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './components/Sidebar.js';
import Store from './components/Store.js';
import $ from 'jquery';

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
    $('.zA').on('click', function(e) {
      var detectEmailLoad = function() {
        var fromDiv = document.getElementsByClassName('gD')[0];
        if (fromDiv) {
          //EMAIL LOADED
          console.log('FROM', document.getElementsByClassName('gD')[0].getAttribute('email'))
        } else {
          setTimeout(detectEmailLoad, 100);
        }
      }
      detectEmailLoad();
    });
  }
}

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