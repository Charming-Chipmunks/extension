import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import {observer} from 'mobx-react';

import Company from './Company.js';
import History from './History.js';
import Tasks from './Tasks.js';
import Emails from './emails';
import EditActionModal from './EditActionModal.js';

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

var collapse = function() {
  document.getElementById('spacer').className = 'sidebar-min-width';
  document.getElementById('ext').className = 'sidebar-min-width';
  Store.collapsed = true;
};

var expand = function() {
  document.getElementById('spacer').className = 'sidebar-max-width';
  document.getElementById('ext').className = 'sidebar-max-width';
  Store.collapsed = false;
};

var Sidebar = observer((props) => {
  if (Store.token) {
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

        if (Store.currentTab === 'email') {
          utils.openEmail();
        }

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
            res.data.forEach(job => {
              job.display = job.company + ': ' + job.jobTitle;
              Store.jobsLookup[job.display] = job;
              Store.jobsLookupById[job.id] = job;
            });
            Store.jobs = res.data;
          }
        });
      }
    });

  }

  return (
    <div className='side-container'>
      {!Store.collapsed && !!Store.token && <div className='nav-header'>
        <i onClick={() => Store.currentTab = 'tasks'} className='material-icons clickable'>home</i>
        <span onClick={() => Store.currentTab = 'tasks'} className='clickable'>tasks (18)</span>
        <span className='clickable'>jobs (7)</span>
        <i className='material-icons clickable'>settings</i>
      </div>}
      {!Store.collapsed && !!Store.token && (Store.currentTab !== 'tasks') && <div>
        <div className={'nav-tab ' + (Store.currentTab === 'tasks' ? 'nav-tab-active' : '')} onClick={() => setTab('tasks')}>Tasks</div>
        <div className={'nav-tab ' + (Store.currentTab === 'company' ? 'nav-tab-active' : '')} onClick={() => setTab('company')}>Company</div>
        <div className={'nav-tab ' + (Store.currentTab === 'email' ? 'nav-tab-active' : '')} onClick={() => utils.openEmail()}>History</div>
      </div>}
      {!Store.collapsed && !Store.token && <div className='xy-center'>
        <div className='center-container'>
          <div className='logo text-center'>(cb)</div>
          <button className='btn' onClick={()=>chrome.runtime.sendMessage({authenticate: true}, (res) => Store.token = res.token)} >Log In</button>
          <button className='btn' onClick={collapse}>&gt;</button> 
        </div>
      </div>}
      {!Store.collapsed && !!Store.token && (Store.currentTab === 'company') && <Company />}
      {!Store.collapsed && !!Store.token && (Store.currentTab === 'tasks') && <Tasks />}
      {!Store.collapsed && !!Store.token && (Store.currentTab === 'email') && <Emails />}
      {!Store.collapsed && !!Store.token && <button className='btn collapse' onClick={collapse}>&gt;</button>}
      {Store.collapsed && <button className='btn collapse' onClick={expand}>&lt;</button>}
    </div>
  );
});

export default Sidebar;