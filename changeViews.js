import $ from 'jquery';
import Store from './components/Store.js';
import mobx from 'mobx';

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
};

var openInbox = function() {
  Store.googlePage = 'inbox';
  Store.currentTab = 'tasks';
};

var addBackButtonListener = function() {
  $('.lS').on('click', function(e) {
    openInbox();
    if (!Store.tableRowListenersEnabled) {
      var detectTableLoad = function() {
        var table = document.getElementsByClassName('zt')[0];
        if (table) {
          addTableRowListeners(table);
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
  addBackButtonListener();

  var timeSpans = document.getElementsByClassName('g3');
  Store.currentEmail = {
    senderEmail: fromDiv.getAttribute('email'),
    senderName: fromDiv.innerHTML,
    time: new Date(timeSpans[timeSpans.length - 1].title.replace(/at /, ' ')).toDateTime()
  };
  
  //Reset data regarding the currently selected job, which is changing.
  Store.currentContact = {};
  Store.currentJobTasks = [];
  Store.currentJobContacts = [];

  //If cached data exists, use it to populate the recently emptied datasets
  if (Store.userId) {
    if (Store.contacts[Store.currentEmail.senderEmail]) {
      Store.currentContact = Store.contacts[Store.currentEmail.senderEmail];
    }
    if (Store.currentContact.job) {
      if (Store.jobContacts[Store.currentContact.job.id]) {
        Store.currentJobContacts = Store.jobContacts[Store.currentContact.job.id];
      }
      if (Store.jobTasks[Store.currentContact.job.id]) {
        Store.currentJobTasks = Store.jobTasks[Store.currentContact.job.id];
      }
    }

    //If cached data was not available, fetch it from the server.
    if (!Store.currentContact.job) {
      chrome.runtime.sendMessage({
        action: 'GET',
        token: Store.token,
        url: `${Store.server}/contacts/jobs/${encodeURIComponent(Store.currentEmail.senderEmail)}/${Store.userId}`
      }, function(res) {
        if (res.err) {
          Store.currentContact = {};
        } else {
          Store.currentContact = res.data;
          Store.contacts[Store.currentEmail.senderEmail] = res.data;
        }
      });
    }
  }
  
  Store.googlePage = 'email';
  Store.currentTab = 'email';
};

obj.openEmail = openEmail;
obj.openInbox = openInbox;
obj.addBackButtonListener = addBackButtonListener;
obj.addTableRowListeners = addTableRowListeners;

export default obj;