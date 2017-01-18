import React from 'react';
import ReactDOM from 'react-dom';

import Store from '../Store.js';
import mobx from 'mobx';
import {observer} from 'mobx-react';

@observer class NewEmailForm extends React.Component {
  constructor(props) {
    super(props)
  }

  changeName(e) {
      Store.currentEmail.senderName = e.target.value;
  }

  changeEmail(e) {
    Store.currentEmail.senderEmail = e.target.value;
  }

  setEmailJob(e) {
    var job = Store.jobsLookup[e.target.value];
    if (job) {
      Store.currentEmail.jobId = job.id;
      Store.currentEmail.company = job.company;
    }
  }

  render() {
    return (
      <div>
        <div>
          <label>Name</label>
          <input type='text' onChange={this.changeName} value={Store.currentEmail.senderName} />
        </div>
        <div>
          <label>Email</label>
          <input type='text' onChange={this.changeEmail} value={Store.currentEmail.senderEmail} />
        </div>
        <div>
          <label>Job</label>
          <input list='select-job-list' id='select-job' onBlur={this.setEmailJob}/>
          <datalist id='select-job-list' className='select-job' >
            {Store.jobs.map( (job, i) => (<option key={i}>{job.display}</option>))}
          </datalist>
        </div>
      </div>
    ); 
  }
};

export default NewEmailForm;