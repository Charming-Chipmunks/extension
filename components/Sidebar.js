import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import {observer} from 'mobx-react';

import Company from './Company.js';
import History from './History.js';
import Tasks from './Tasks.js';

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
    // alert(res.data);
    Store.user = res.data;
    // console.log('store', Store.user);
  }
});

chrome.runtime.sendMessage({
  action: 'GET',
  url: Store.server + '/actions/' + Store.userId
}, function(res) {
  if (res.err) {
    alert('error:' + err);
  } else {
    // alert(res.data);
    Store.tasks = res.data;
    console.log('Task data', Store.tasks);
  }
});

var Sidebar = observer((props) => {
  return (
    <div className='side-container'>
      <div>
        <h3 className={'nav-tab ' + (Store.currentTab === 'tasks' ? 'nav-tab-active' : '')} onClick={() => setTab('tasks')}>Tasks</h3>
        <h3 className={'nav-tab ' + (Store.currentTab === 'company' ? 'nav-tab-active' : '')} onClick={() => setTab('company')}>Company</h3>
        <h3 className={'nav-tab ' + (Store.currentTab === 'history' ? 'nav-tab-active' : '')} onClick={() => setTab('history')}>History</h3>
      </div>
      {(Store.currentTab === 'company') && <Company />}
      {(Store.currentTab === 'history') && <History />}
      {(Store.currentTab === 'tasks') && <Tasks />}
    </div>
  );
});

export default Sidebar;