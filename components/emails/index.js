import React from 'react';
import ReactDOM from 'react-dom';

import Store from '../Store.js';
import {observer} from 'mobx-react';
import utils from '../../changeViews.js';
import ReceivedEmailAction from './ReceivedEmailAction.js';
import Modal from '../Modal.js';
import Action from './Action.js';
import NewContactForm from './NewContactForm.js';
import ExistingContact from './ExistingContact.js';
import NewEmailForm from './NewEmailForm.js';
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

@observer class Emails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

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

    var setEmailDescription = function(e) {
      Store.currentEmail.description = e.target.value;
    };

    if (Store.currentJobTasks.some(record => record.actionSource === 'user' && record.completedTime.replace(/T/, ' ').slice(0, 19) === Store.currentEmail.time)) {
      var emailLogged = true;
    }          

    return (
      <div>
        <div>{Store.currentEmail.warning}</div>
        {!Store.currentContact.contact && <NewContactForm />}
        {!!Store.currentContact.contact && <ExistingContact />}
        {!emailLogged && <NewEmailForm />}
     
        {!!Store.currentJobTasks.length && <div>History</div>}
        {!!Store.currentJobTasks.length && <div className='y-scroll'>
          {Store.currentJobTasks
            .filter(record => record.actionSource === 'user')
            .sort((a, b) => a.completedTime <= b.completedTime ? 1 : 0)
            .map((record, i) => <Action key={i} action={record} />)
          }
        </div>}
      </div>
    );
  }
};

export default Emails;