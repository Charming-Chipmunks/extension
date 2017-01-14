import React from 'react';
import ReactDOM from 'react-dom';

import Store from '../Store.js';
import {observer} from 'mobx-react';
import utils from '../../changeViews.js';
import ReceivedEmailAction from './ReceivedEmailAction.js';

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
};

var emailIcon = 'https://puu.sh/t6VbF/f01ab2fd8e.png';
var phoneIcon = 'https://puu.sh/t6VwW/ab509518d2.png';

var Emails = observer((props) => {

  if (Store.currentContact.job && !Store.currentJobContacts.length) {
    chrome.runtime.sendMessage({
      action: 'GET',
      token: Store.token,
      url: `${Store.server}/contacts/${Store.userId}/${Store.currentContact.job.id}`
    }, function(res) {
      if (res.err) {
        console.log('error loading job contacts', err);
      } else {
        console.log('job contacts', res.data);
        Store.currentJobContacts = res.data;
      }
    });
  }

  if (Store.currentContact.job && !Store.currentJobTasks.length) {
    chrome.runtime.sendMessage({
      action: 'GET',
      token: Store.token,
      url: `${Store.server}/actions/${Store.userId}/${Store.currentContact.job.id}`
    }, function(res) {
      if (res.err) {
        console.log('error getting job actions', res.err);
      } else {
        Store.currentJobTasks = res.data;
      }
    });
  }

  var addAction = function() {
    if (Store.currentContact.job) {
      Store.currentEmail.company = Store.currentContact.job.company;
      Store.currentEmail.jobId = Store.currentContact.job.id;
    }
    chrome.runtime.sendMessage({
      action: 'POST',
      url: Store.server + '/actions',
      token: Store.token,
      data: {
        type: 'sentEmail',
        company: Store.currentEmail.company,
        description: Store.currentEmail.description,
        actionSource: 'user',
        completedTime: Store.currentEmail.time,
        jobId: Store.currentEmail.jobId,
        userId: Store.userId,
        contactId: 1
      }
    }, function(res) {
      utils.openEmail();
    });
    Store.currentEmail;
  };

  var addActionHandler = function() {
    if (!Store.currentContact.contact) {
      var name = Store.currentEmail.senderName.split(' ');
      chrome.runtime.sendMessage({
        action: 'POST',
        token: Store.token,
        url: `${Store.server}/contacts/${Store.userId}/${Store.currentEmail.jobId}`,
        data: {
          firstname: name[0],
          lastname: name[1],
          email: Store.currentEmail.senderEmail
        }
      }, function(res) {
        if (res.err) {
          console.log('Error adding user', res.err);
        } else {
          Store.currentContact.contact = res.data;
          addAction();
        }
      });
    } else {
      addAction();
    }
  };

  var setEmailJob = function(e) {
    Store.currentEmail.jobId = e.target.options[e.target.selectedIndex].value;
    Store.currentEmail.company = e.target.options[e.target.selectedIndex].getAttribute('data-company');
  };

  var setEmailDescription = function(e) {
    Store.currentEmail.description = e.target.value;
  };

  var changeName = function(e) {
    Store.currentEmail.senderName = e.target.value;
  };

  var changeEmail = function(e) {
    Store.currentEmail.senderEmail = e.target.value;
  };

  var changeTime = function(e) {
    Store.currentEmail.time = e.target.value;
  };

  var timeSince = function(date) {

    var seconds = Math.floor((new Date() - new Date(date)) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + ' years';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + ' months';
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + ' days';
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + ' hours';
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  };

  if (Store.currentJobTasks.filter(record => record.actionSource === 'user' && record.completedTime.replace(/T/, ' ').slice(0, 19) === Store.currentEmail.time).length) {
    var emailLogged = true;
  }          

  return (
    <div>
      <div>{Store.currentEmail.warning}</div>
      {!Store.currentContact.contact && <input type='text' onChange={changeName} value={Store.currentEmail.senderName} />}
      {!Store.currentContact.contact && <br />}
      {!Store.currentContact.contact && <input type='text' onChange={changeEmail} value={Store.currentEmail.senderEmail} />}
      {!Store.currentContact.contact && <br />}
      {Store.currentContact.contact && Store.currentContact.contact.firstname !== Store.currentContact.contact.email && <div>{Store.currentContact.contact.firstname + (Store.currentContact.contact.lastname ? ' ' + Store.currentContact.contact.lastname : '')}</div>}
      {Store.currentContact.contact && <div>{Store.currentContact.contact.email}</div>}
      {!emailLogged && <input type='text' onChange={changeTime} value={Store.currentEmail.time} />}
      {emailLogged && <div>{Store.currentEmail.time}</div>}
      {!Store.currentContact.contact && <select onChange={setEmailJob}>
        <option value='1' data-company='none selected'>SELECT</option>
        {Store.jobs.map( (job, i) => (<option value={job.id} data-company={job.company} key={i}>{job.company}: {job.jobTitle}</option>))}
      </select>}
      {Store.currentContact.job && <div>{Store.currentContact.job.jobTitle}</div>}
      {!emailLogged && <input type="text" onChange={setEmailDescription} placeholder="Description" />}
      {!Store.currentEmail.warning && !emailLogged && <button onClick={addActionHandler}>Submit</button>}
   
      {Store.currentJobTasks.length && <div>History</div>}
      {Store.currentJobTasks.length && <div>
        {Store.currentJobTasks.filter(record => record.actionSource === 'user').sort((a, b) => a.completedTime <= b.completedTime ? 1 : 0).map((record, i) => {
          if (record.type === 'email' || record.type === 'sentEmail' || record.type === 'receivedEmail') {
            var taskIcon = emailIcon;
          } else if (record.type === 'phone') {
            var taskIcon = phoneIcon;
          } 

          if (record.completedTime.replace(/T/, ' ').slice(0, 19) === Store.currentEmail.time) {
            var thisEmail = true;
          }

          if (record.type === 'receivedEmail' || record.type === 'email') {
            var type = 'Got email from ';
          }

          if (record.type === 'sentEmail') {
            var type = 'Sent email to ';
          }

          return (
            <div key={i} className={thisEmail ? 'current-email' : ''}>
              <img src={taskIcon} />
              <div>{timeSince(record.completedTime)} ago</div>
              {!!Store.currentJobContacts.length && <div>{type}{Store.currentJobContacts[0].firstname + ' ' + Store.currentJobContacts[0].lastname}</div>}
              {!type && <div>{record.type}</div>}
              <div>{record.description}</div>
              {thisEmail && <div>This Email</div>}
              <hr />
            </div>
          );
        })}
      </div>}
    </div>
  );
});

export default Emails;