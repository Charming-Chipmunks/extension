import React from 'react';
import ReactDOM from 'react-dom';

import Store from '../Store.js';
import {observer} from 'mobx-react';
import utils from '../../changeViews.js';
import ReceivedEmailAction from './ReceivedEmailAction.js';
import Modal from '../Modal.js';
import Action from './Action.js';
// import $ from 'jquery';

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

@observer class Emails extends React.Component {

  componentDidUpdate() {
    // $('select').material_select();
    $('#select-job').on('focus', function(e) {
      console.log('received focus', e.target);
      var keyboardEvent = document.createEvent("KeyboardEvent");
      var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";


      keyboardEvent[initMethod](
        "keydown", // event type : keydown, keyup, keypress
        true, // bubbles
        true, // cancelable
        window, // viewArg: should be window
        false, // ctrlKeyArg
        false, // altKeyArg
        false, // shiftKeyArg
        false, // metaKeyArg
        40, // keyCodeArg : unsigned long the virtual key code, else 0
        40 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
      );
      // e.target.focus();
      setTimeout(() => e.target.click(), 250);
    });
  }

  componentWillUnmount() {
    // $('.sidebar-content select').material_select('destroy');
  }


  render() {
    if (!Store.userId) {
      console.log('still loading')
    }

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
          console.log(Store.currentJobTasks);
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
          type: 'receivedEmail',
          company: Store.currentEmail.company,
          description: Store.currentEmail.description,
          actionSource: 'user',
          completedTime: Store.currentEmail.time,
          jobId: Store.currentEmail.jobId,
          userId: Store.userId,
          contactId: Store.currentContact.contact.id
        }
      }, function(res) {
        utils.openEmail();
      });
      Store.currentEmail;
    };

    var addActionHandler = function() {
      if (!Store.currentContact.contact) {
        var name = Store.currentEmail.senderName.split(' ');
        document.getElementsByClassName('')
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
      var job = Store.jobsLookup[e.target.value];
      if (job) {
        Store.currentEmail.jobId = job.id;
        Store.currentEmail.company = job.company;
      }
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

    if (Store.currentJobTasks.filter(record => record.actionSource === 'user' && record.completedTime.replace(/T/, ' ').slice(0, 19) === Store.currentEmail.time).length) {
      var emailLogged = true;
    }          

    return (
      <div>
        <div>{Store.currentEmail.warning}</div>
        {!Store.currentContact.contact && <div>
          <label>Name</label>
          <input type='text' onChange={changeName} value={Store.currentEmail.senderName} />
        </div>}
        {!Store.currentContact.contact && <div>
          <label>Email</label>
          <input type='text' onChange={changeEmail} value={Store.currentEmail.senderEmail} />
        </div>}
        {!!Store.currentContact.contact && Store.currentContact.contact.firstname !== Store.currentContact.contact.email && <div>{Store.currentContact.contact.firstname + (Store.currentContact.contact.lastname ? ' ' + Store.currentContact.contact.lastname : '')}</div>}
        {!!Store.currentContact.contact && <div>{Store.currentContact.contact.email}</div>}

        {!Store.currentContact.contact && <div>
          <label>Job</label>
          <input list='select-job-list' id='select-job' onBlur={setEmailJob}/>
          <datalist id='select-job-list' className='select-job' >
            {Store.jobs.map( (job, i) => (<option key={i}>{job.display}</option>))}
          </datalist>
        </div>}
        {Store.currentContact.job && <div>{Store.currentContact.job.company}: {Store.currentContact.job.jobTitle}</div>}
        {!!Store.currentContact.contact && <hr />}
        {!emailLogged && <div>
          <label>Description</label>
          <input type="text" onChange={setEmailDescription} />
          </div>}
        {!Store.currentEmail.warning && !emailLogged && <button className='btn' onClick={addActionHandler}>Submit</button>}
     
        {!!Store.currentJobTasks.length && <div>History</div>}
        {!!Store.currentJobTasks.length && <div className='y-scroll'>
          {Store.currentJobTasks.filter(record => record.actionSource === 'user').sort((a, b) => a.completedTime <= b.completedTime ? 1 : 0).map((record, i) => <Action key={i} action={record} />)}
        </div>}
      </div>
    );
  }
};

export default Emails;