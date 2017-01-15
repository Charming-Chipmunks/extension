import $ from 'jquery';
import Store from './components/Store.js';

var obj = {};

var addTableRowListeners = function() {
  var table = document.getElementsByClassName('zt')[0];
  $(table).on('click', '.zA', function(e) {
    var detectEmailLoad = function() {
      var fromDiv = document.getElementsByClassName('gD')[0];
      if (fromDiv) {
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
  $('.lS').on('click', function(e) {
    Store.currentTab = 'tasks';
    if (!Store.tableRowListenersEnabled) {
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
  console.log('opening email');
  var fromDiv = document.getElementsByClassName('gD')[0];
  addBackButtonListener();

  var timeSpans = document.getElementsByClassName('g3');
  Store.currentEmail = {
    senderEmail: fromDiv.getAttribute('email'),
    senderName: fromDiv.innerHTML,
    time: new Date(timeSpans[timeSpans.length - 1].title.replace(/at /, ' ')).toDateTime()
  };
  console.log(new Date(timeSpans[timeSpans.length - 1].title.replace(/at /, ' ')));
  
  Store.currentContact = {};
  Store.currentJobTasks = [];
  Store.currentJobContacts = [];
  chrome.runtime.sendMessage({
    action: 'GET',
    token: Store.token,
    url: `${Store.server}/contacts/jobs/${encodeURIComponent(Store.currentEmail.senderEmail)}/${Store.userId}`
  }, function(res) {
    if (res.err) {
      Store.currentContact = {};
      console.log('error loading contact', res.err);
    } else {
      Store.currentContact = res.data;
    }
  });
  
  Store.currentTab = 'email';
};

obj.openEmail = openEmail;
obj.addBackButtonListener = addBackButtonListener;
obj.addTableRowListeners = addTableRowListeners;

export default obj;