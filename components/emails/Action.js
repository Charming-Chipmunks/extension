import React from 'react';
import ReactDOM from 'react-dom';
import Store from '../Store.js';
import {observer} from 'mobx-react';

var iconLookup = {
  like: 'thumb_up',
  learn: 'computer',
  connections: 'contact_phone',
  connect: 'contact_phone',
  apply: 'send',
  'follow up': 'loop',
  interview: 'bookmark',
  schedule: 'assignment',
  email: 'email',
  sentEmail: 'email',
  receivedEmail: 'email',
  phone: 'phone',
  call: 'phone',
  offer: 'stars',
  meetup: 'build',
  resume: 'reorder'
}


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

@observer class Action extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    if (Store.currentJobTasks.filter(record => record.actionSource === 'user' && record.completedTime.replace(/T/, ' ').slice(0, 19) === Store.currentEmail.time).length) {
      var emailLogged = true;
    } 

    var record = this.props.action;

    //TODO: use contact associated with the current action.
    var contactName = Store.currentJobContacts[0].firstname + ' ' + Store.currentJobContacts[0].lastname;

    var descriptionLookup = {
      create: 'Created this job',
      like: 'Liked this job',
      learn: 'Learned about job',
      connections: 'Connected with people',
      connect: 'Connected with people',
      apply: 'Sent an application',
      'follow up': 'You followed up',  //TODO: associate contact?
      interview: 'Interviewed for this job',
      phoneInterview: 'Phone interview', //TODO: associate contact?
      schedule: 'schedule**',
      email: 'email**',
      sentEmail: 'Sent email to ' + contactName,
      receivedEmail: 'Got email from ' + contactName,
      phone: 'Spoke with ' + contactName,
      call: 'Spoke with ' + contactName,
      offer: 'You got an offer!',
      meetup: 'meetup**',
      resume: 'Submitted resume'
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
      <div className={thisEmail ? 'current-email history-item done' : 'history-item done'}>
        <i className='material-icons history-item-icon'>{iconLookup[record.type]}</i>
        <div className='header'>
          <div className='notes'>
            <div>{timeSince(record.completedTime)} ago</div>
            {thisEmail && <div>This Email</div>}
          </div>
          <div className='from'>{descriptionLookup[record.type] || 'unknown type'}</div>
        </div>
        <div className='body'>{record.description}</div>
      </div>
    ) 
  }
};

export default Action;