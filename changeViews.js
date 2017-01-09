import $ from 'jquery';
import Store from './components/Store.js';

var obj = {};

var addTableRowListeners = function() {
  var table = document.getElementsByClassName('zt')[0];
  $(table).on('click', '.zA', function(e) {
    console.log('you clicked me');
    var detectEmailLoad = function() {
      var fromDiv = document.getElementsByClassName('gD')[0];
      if (fromDiv) {
        console.log('going to open email');
        openEmail();
      } else {
        setTimeout(detectEmailLoad, 100);
      }
    };
    detectEmailLoad();
  }.bind(this));
  Store.tableRowListenersEnabled = true;
  console.log('added row listeners', Store.tableRowListenersEnabled);
};

var addBackButtonListener = function() {
  console.log('adding back listener');
  $('.lS').on('click', function(e) {
    Store.currentTab = 'tasks';
    console.log('start');
    if (!Store.tableRowListenersEnabled) {
      console.log('need to add row listeners');
      var detectTableLoad = function() {
        var table = document.getElementsByClassName('zt')[0];
        if (table) {
          addTableRowListeners(table);
          console.log('done');
        } else {
          setTimeout(detectTableLoad, 100);
        }
      }.bind(this);
      detectTableLoad();
    }
  });
};

var openEmail = function() {
  var fromDiv = document.getElementsByClassName('gD')[0];
  console.log('opening email');
  addBackButtonListener();

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
};

obj.openEmail = openEmail;
obj.addBackButtonListener = addBackButtonListener;
obj.addTableRowListeners = addTableRowListeners;

export default obj;