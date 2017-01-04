import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import {observer} from 'mobx-react';

import Company from './Company.js';
import History from './History.js';

var setTab = function(tab) {
  Store.currentTab = tab;
}

chrome.runtime.sendMessage({
  action: 'GET',
  url: 'http://jobz.mooo.com/jobs/1'
}, function(res) {
  if (res.err) {
    alert('error:'+err);
  } else {
    // alert(res.data);
    Store.user = res.data;
    console.log('store', Store.user);
  }
});

var Sidebar = observer((props) => {
  return (
    <div className='side-container'>
      <div>
        <h3 className={"nav-tab " + (Store.currentTab === 'company' ? 'nav-tab-active' : '')} onClick={() => setTab('company')}>Company</h3>
        <h3 className={"nav-tab " + (Store.currentTab === 'history' ? 'nav-tab-active' : '')} onClick={() => setTab('history')}>History</h3>
      </div>
      {(Store.currentTab === 'company') && <Company />}
      {(Store.currentTab === 'history') && <History />}
    </div>
  );
});

export default Sidebar;