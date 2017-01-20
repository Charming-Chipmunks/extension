import React from 'react';
import ReactDOM from 'react-dom';

import Store from '../Store.js';
import mobx from 'mobx';
import {observer} from 'mobx-react';
import utils from '../../changeViews.js';
// import $ from 'jquery';

@observer class NewEmailForm extends React.Component {
  constructor(props) {
    super(props)
    this.addActionHandler = this.addActionHandler.bind(this);
  }

  addAction() {
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

  addActionHandler() {
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
          this.addAction();
        }
      });
    } else {
      this.addAction();
    }
  };

  setEmailDescription(e) {
    Store.currentEmail.description = e.target.value;
  };

  componentDidMount() {
    $('select').material_select();
  }

  render() {
    return (
      <div>
        <div>
          <label>Description</label>
          <input type="text" onChange={this.setEmailDescription} />
        </div>
        {false && <div>
          <label>Outcome</label>
          <select>
            <option>General Correspondance</option>
            <option>Invitation to apply</option>
            <option>Invitation to interview</option>
            <option>Rejection</option>
          </select>
        </div>}
        <button className='btn light-blue darken-3' onClick={this.addActionHandler}>Submit</button>
      </div>
    ); 
  }
};

export default NewEmailForm;