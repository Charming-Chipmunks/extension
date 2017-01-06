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
    console.log(Store.currentEmail.senderName);
  } else {
    Store.currentEmail = {warning: 'Please open an email first.'};
  }
};

// grabEmail();

var Emails = observer((props) => {

  var addAction = function() {
    console.log('data', Store.currentEmail);
    // chrome.runtime.sendMessage({
    //   action: 'POST',
    //   url: Store.server + '/actions',
    //   data: {
    //     type: 'email',
    //     company: 'test',
    //     description: 'my description',
    //     actionSource: 'user',
    //     completedTime: 'NOW',
    //     jobId: Store.currentEmail.jobId,
    //     userId: Store.userId
    //   }
    // }, function(res) {
    //   console.log(res);
    // });
  };

  var setEmailJob = function(e) {
    Store.currentEmail.jobId = e.target.options[e.target.selectedIndex].value;
    Store.currentEmail.company = e.target.options[e.target.selectedIndex].getAttribute('data-company');
  };

  var setEmailDescription = function(e) {
    Store.currentEmail.description = e.target.value;
  };

  return (
    <div>
      <button onClick={grabEmail}>Record this email</button>
      <div>{Store.currentEmail.warning}</div>
      <div>{Store.currentEmail.senderName}</div>
      <div>{Store.currentEmail.senderEmail}</div>
      <select onChange={setEmailJob}>
        {Store.jobs.map( (job, i) => (<option value={job.id} data-company={job.company} key={i}>{job.jobTitle}</option>))}
      </select>
      <input type="text" onChange={setEmailDescription} placeholder="Description" />
      {!Store.currentEmail.warning && <button onClick={addAction}>Submit</button>}
    </div>
  );
});

export default Emails;