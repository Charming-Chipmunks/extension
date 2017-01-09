import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import {observer} from 'mobx-react';

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

// grabEmail();

var Emails = observer((props) => {
  console.log('hi', Store.currentContact);
  if (Store.currentContact.job && !Store.currentJobTasks.length) {
    console.log('fetching events');
    chrome.runtime.sendMessage({
      action: 'GET',
      url: `${Store.server}/actions/${Store.userId}/${Store.currentContact.job.id}`
    }, function(res) {
      if (res.err) {
        console.log('error getting job actions', res.err);
      } else {
        Store.currentJobTasks = res.data;
        console.log(Store.currentJobTasks);
      }
    });
  }

  var addAction = function() {
    console.log('adding action', Store.currentEmail);
    chrome.runtime.sendMessage({
      action: 'POST',
      url: Store.server + '/actions',
      data: {
        type: 'email',
        company: Store.currentEmail.company,
        description: Store.currentEmail.description,
        actionSource: 'user',
        completedTime: Store.currentEmail.time,
        jobId: Store.currentEmail.jobId,
        userId: Store.userId,
        contactId: 1
      }
    }, function(res) {
      console.log(res);
    });
    Store.currentEmail;
  };

  var addActionHandler = function() {
    if (!Store.currentContact.contact) {
      var name = Store.currentEmail.senderName.split(' ');
      chrome.runtime.sendMessage({
        action: 'POST',
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
          console.log('new contact', Store.currentContact.contact);
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

  return (
    <div>
      <button onClick={grabEmail}>Record this email</button>
      <div>{Store.currentEmail.warning}</div>
      {!Store.currentContact.contact && <input type='text' onChange={changeName} value={Store.currentEmail.senderName} />}
      {!Store.currentContact.contact && <br />}
      {!Store.currentContact.contact && <input type='text' onChange={changeEmail} value={Store.currentEmail.senderEmail} />}
      {!Store.currentContact.contact && <br />}
      {Store.currentContact.contact && <div>{Store.currentContact.contact.firstname + ' ' + Store.currentContact.contact.lastname}</div>}
      {Store.currentContact.contact && <div>{Store.currentContact.contact.email}</div>}
      <input type='text' onChange={changeTime} value={Store.currentEmail.time} />
      {!Store.currentContact.contact && <select onChange={setEmailJob}>
        <option value='1' data-company='none selected'>SELECT</option>
        {Store.jobs.map( (job, i) => (<option value={job.id} data-company={job.company} key={i}>{job.jobTitle}</option>))}
      </select>}
      {Store.currentContact.contact && <div>{Store.currentContact.job.jobTitle}</div>}
      <input type="text" onChange={setEmailDescription} placeholder="Description" />
      {!Store.currentEmail.warning && <button onClick={addActionHandler}>Submit</button>}
   
      {Store.currentJobTasks.length && <div>History</div>}
      {Store.currentJobTasks.length && <div>
        {Store.currentJobTasks.filter(record => record.actionSource === 'user').sort((a, b) => a.completedTime >= b.completedTime ? 1 : 0).map((record, i) => {
          if (record.type === 'email') {
            var taskIcon = emailIcon;
          } else if (record.type === 'phone') {
            var taskIcon = phoneIcon;
          } 

          if (record.completedTime.replace(/T/, ' ').slice(0, 19) === Store.currentEmail.time) {
            var thisEmail = true;
          }

          return (
            <div key={i} className={thisEmail ? 'current-email' : ''}>
              <img src={taskIcon} />
              <div>Completed at {record.completedTime}</div>
              <div>{record.type}</div>
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