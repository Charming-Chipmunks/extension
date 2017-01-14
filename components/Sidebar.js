import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import {observer} from 'mobx-react';

import Company from './Company.js';
import History from './History.js';
import Tasks from './Tasks.js';
import Emails from './emails';

import utils from '../changeViews.js';

var setTab = function(tab) {
  Store.currentTab = tab;
};


var grabEmail = function() {
  var fromDiv = document.getElementsByClassName('gD')[0];
  if (fromDiv) {
    utils.openEmail();
  } else {
    Store.currentEmail = {warning: 'Please open an email first.'};
  }

  Store.currentTab = 'email';
};

var Sidebar = observer((props) => {
  if (Store.token) {
    console.log('UserId', Store.userId);
    chrome.runtime.sendMessage({
      action: 'GET',
      url: Store.server + '/user',
      token: Store.token
    }, function(res) {
      if (res.err) {
        alert('error:' + res.err);
      } else {
        Store.currentUserObject = res.data;
        Store.userId = res.data.id;

        // chrome.runtime.sendMessage({
        //   action: 'GET',
        //   url: Store.server + '/jobs/' + Store.userId + '/favored',
        //   token: Store.token
        // }, function(res) {
        //   if (res.err) {
        //     alert('error:' + res.err);
        //   } else {
        //     Store.user = res.data;
        //   }
        // });

        chrome.runtime.sendMessage({
          action: 'GET',
          url: Store.server + '/actions/' + Store.userId,
          token: Store.token
        }, function(res) {
          if (res.err) {
            alert('error:' + res.err);
          } else {
            Store.tasks = res.data;
          }
        });

        chrome.runtime.sendMessage({
          action: 'GET',
          url: Store.server + '/jobs/' + Store.userId + '/favored',
          token: Store.token
        }, function(res) {
          if (res.err) {
            alert('error:' + res.err);
          } else {
            Store.jobs = res.data;
          }
        });
        
      }
    });

  }

  return (
    <div className='side-container'>
      {!Store.collapsed && !Store.token && <div className='xy-center'>
        <div className='center-container'>
          <div className='logo text-center'>(cb)</div>
          <button className='btn' onClick={()=>chrome.runtime.sendMessage({authenticate: true}, (res) => Store.token = res.token)} >Log In</button>
          <button className='btn' onClick={function() {
            console.log('I\'m shrinking');
            document.getElementById('spacer').className = 'sidebar-min-width';
            document.getElementById('ext').className = 'sidebar-min-width';
            Store.collapsed = true;
          }}>Collapse</button>      
        </div>
      </div>}
      {!Store.collapsed && !!Store.token && <div>
        <h3 className={'nav-tab ' + (Store.currentTab === 'tasks' ? 'nav-tab-active' : '')} onClick={() => setTab('tasks')}>Tasks</h3>
        <h3 className={'nav-tab ' + (Store.currentTab === 'company' ? 'nav-tab-active' : '')} onClick={() => setTab('company')}>Company</h3>
        <h3 className={'nav-tab ' + (Store.currentTab === 'history' ? 'nav-tab-active' : '')} onClick={() => setTab('history')}>History</h3>
      </div>}
      {!Store.collapsed && !!Store.token && (Store.currentTab === 'company') && <Company />}
      {!Store.collapsed && !!Store.token && (Store.currentTab === 'history') && <History />}
      {!Store.collapsed && !!Store.token && (Store.currentTab === 'tasks') && <Tasks />}
      {!Store.collapsed && !!Store.token && (Store.currentTab === 'email') && <Emails />}
      {!Store.collapsed && !!Store.token && <button className='btn collapse' onClick={function() {
        console.log('I\'m shrinking');
        document.getElementById('spacer').className = 'sidebar-min-width';
        document.getElementById('ext').className = 'sidebar-min-width';
        Store.collapsed = true;
      }}>&gt;</button>}
      {Store.collapsed && <div className='xy-center'>
        <button className='btn' onClick={function() {
          console.log('I\'m growing');
          document.getElementById('spacer').className = 'sidebar-max-width';
          document.getElementById('ext').className = 'sidebar-max-width';
          Store.collapsed = false;
        }}>&lt;</button>
      </div>}
    </div>
  );
});

export default Sidebar;