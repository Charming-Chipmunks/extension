import React from 'react';
import ReactDOM from 'react-dom';
import Store from './Store.js';
import {observer} from 'mobx-react';
import moment from 'moment';

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
    var contactName = 'NO NAME';//Store.currentJobContacts[0].firstname + ' ' + Store.currentJobContacts[0].lastname;

    var descriptionLookup = {
      learn: 'Learn about the job',
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

    var days = Math.floor((new Date(record.scheduledTime).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
    if (days < -1) {
      var dueDate = 'Due ' + Math.abs(days) + ' days ago';
      var dateClass = ' overdue';
    } else if (days === -1) {
      var dueDate = 'Due yesterday';
      var dateClass = ' overdue';
    } else if (days === 0) {
      var dueDate = 'Due today';
      var dateClass = ' today';
    } else if (days === 1) {
      var dueDate = 'Due tomorrow';
      var dateClass = '';
    } else {
      var dueDate = 'Due in ' + days + ' days';
      var dateClass = '';
    }

    return (
      <div className={'history-item' + dateClass}>
        <i className='material-icons history-item-icon'>{iconLookup[record.type]}</i>
        <div className='header'>
          <div className='notes'>
            <div>{dueDate}</div>
          </div>
          <div className='from'>{record.type}</div>
          <div className='body'>
            {record.company}: {Store.jobsLookupById[record.JobId] && Store.jobsLookupById[record.JobId].jobTitle}
            <i className='material-icons history-item-done clickable' onClick={this.props.completed.bind(this, record)}>done</i>
          </div>
        </div>
      </div>
    ) 
  }
};

export default Action;