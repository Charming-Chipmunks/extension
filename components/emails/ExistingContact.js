import React from 'react';
import ReactDOM from 'react-dom';

import Store from '../Store.js';
import mobx from 'mobx';
import {observer} from 'mobx-react';

@observer class NewEmailForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    var contact = Store.currentContact.contact;
    if (contact.lastname) {
      var name = contact.firstname + ' ' + contact.lastname;
    } else {
      var name = contact.firstname;
    }

    var job = Store.currentContact.job;
    var jobName = job.company + ': ' + job.jobTitle;

    return (
      <div>
        <div>{name}</div>
        <div>{Store.currentContact.contact.email}</div>
        <div>{jobName}</div>
        <hr />
      </div>
    ); 
  }
};

export default NewEmailForm;