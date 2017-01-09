import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import {observer} from 'mobx-react';

import Company from './Company.js';
import History from './History.js';
import Tasks from './Tasks.js';
import Emails from './Emails.js';

var setTab = function(tab) {
  Store.currentTab = tab;
};

chrome.runtime.sendMessage({
  action: 'GET',
  url: Store.server + '/jobs/' + Store.userId + '/favored'
}, function(res) {
  if (res.err) {
    alert('error:' + err);
  } else {
    Store.user = res.data;
  }
});

chrome.runtime.sendMessage({
  action: 'GET',
  url: Store.server + '/actions/' + Store.userId
}, function(res) {
  if (res.err) {
    alert('error:' + err);
  } else {
    Store.tasks = res.data;
  }
});

chrome.runtime.sendMessage({
  action: 'GET',
  url: Store.server + '/jobs/' + Store.userId + '/new'
}, function(res) {
  if (res.err) {
    alert('error:' + err);
  } else {
    Store.jobs = res.data;
    console.log('Job data', Store.jobs);
  }
});

var grabEmail = function() {
  var fromDiv = document.getElementsByClassName('gD')[0];
  if (fromDiv) {
    Store.currentEmail = {
      senderEmail: fromDiv.getAttribute('email'),
      senderName: fromDiv.innerHTML
    };
  } else {
    Store.currentEmail = {warning: 'Please open an email first.'};
  }

  Store.currentTab = 'email';
};

var Sidebar = observer((props) => {
  return (
    <div className='side-container'>
      {(Store.currentTab !== 'email') && <button onClick={grabEmail}>Record this email</button>}
      <div>
        <h3 className={'nav-tab ' + (Store.currentTab === 'tasks' ? 'nav-tab-active' : '')} onClick={() => setTab('tasks')}>Tasks</h3>
        <h3 className={'nav-tab ' + (Store.currentTab === 'company' ? 'nav-tab-active' : '')} onClick={() => setTab('company')}>Company</h3>
        <h3 className={'nav-tab ' + (Store.currentTab === 'history' ? 'nav-tab-active' : '')} onClick={() => setTab('history')}>History</h3>
      </div>
      {(Store.currentTab === 'company') && <Company />}
      {(Store.currentTab === 'history') && <History />}
      {(Store.currentTab === 'tasks') && <Tasks />}
      {(Store.currentTab === 'email') && <Emails />}
    </div>
  );
});

export default Sidebar;