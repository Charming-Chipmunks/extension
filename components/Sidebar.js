import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import {observer} from 'mobx-react';

import Company from './Company.js';
import Companies from './Companies.js';
import History from './History.js';
import Tasks from './Tasks.js';
import Emails from './emails';
import Settings from './Settings.js';
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

var toggleCollapse = function() {
  if (Store.collapsed) {
    document.getElementById('spacer').className = 'sidebar-max-width';
    document.getElementById('ext').className = 'sidebar-max-width';
    Store.collapsed = false;
  } else {
    document.getElementById('spacer').className = 'sidebar-min-width';
    document.getElementById('ext').className = 'sidebar-min-width';
    Store.collapsed = true;
  }
};

var Sidebar = observer((props) => {
  if (Store.token && !Store.userId) {
    chrome.runtime.sendMessage({
      action: 'GET',
      url: Store.server + '/user',
      token: Store.token
    }, function(res) {
      if (res.err) {
        alert('error:' + res.err);
      } else {
        Store.currentUserObject = res.data;
        Store.currentUser = res.data.googleName;
        Store.userId = res.data.id;

        if (Store.currentTab === 'email') {
          utils.openEmail();
        }

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

  var openTaskCount = Store.tasks
    .slice()
    .filter(record => !record.completedTime)
    .length;

  var displayOpenTaskCount = openTaskCount ? ` (${openTaskCount})` : '';

  var jobCount = Store.jobs.slice().length;

  var displayJobCount = jobCount ? ` (${jobCount})` : '';

  console.log('current contact', Store.currentContact);
  return (
    <div className='side-container'>
      {!Store.collapsed && !!Store.token && <div className='nav-header'>
        <span onClick={() => Store.currentTab = 'tasks'} className={Store.currentTab === 'tasks' ? 'clickable active' : 'clickable'}>all tasks{displayOpenTaskCount}</span>
        <span onClick={() => Store.currentTab = 'companies'} className={Store.currentTab === 'companies' ? 'clickable active' : 'clickable'}>all jobs{displayJobCount}</span>
        {(Store.googlePage === 'email') && <span onClick={() => Store.currentTab = 'email'} className={Store.currentTab === 'email' ? 'clickable active' : 'clickable'}>{Store.currentContact.job ? Store.currentContact.job.company : 'new message'}</span>}
        <i onClick={() => Store.currentTab = 'settings'} className={Store.currentTab === 'settings' ? 'material-icons clickable active' : 'material-icons clickable'}>settings</i>
      </div>}
      {!Store.collapsed && !Store.token && <div className='xy-center'>
        <div className='center-container'>
          <div className='logo text-center'>(cb)</div>
          <button className='btn light-blue darken-3' onClick={() => chrome.runtime.sendMessage({authenticate: true}, (res) => Store.token = res.token)} >Log In</button>
        </div>
      </div>}
      {!Store.collapsed && !!Store.token && (Store.currentTab === 'tasks') && <Tasks />}
      {!Store.collapsed && !!Store.token && (Store.currentTab === 'companies') && <Companies />}
      {!Store.collapsed && !!Store.token && (Store.currentTab === 'email') && <Emails />}
      {!Store.collapsed && !!Store.token && (Store.currentTab === 'settings') && <Settings />}
      <div className='collapse clickable' onClick={toggleCollapse}>{Store.collapsed ? '<<' : '>>'}</div>
    </div>
  );
});

export default Sidebar;