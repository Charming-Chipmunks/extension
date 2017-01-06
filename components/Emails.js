import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import {observer} from 'mobx-react';

var Emails = observer((props) => {
  var grabEmail = function() {
    var fromDiv = document.getElementsByClassName('gD')[0];
    console.log(fromDiv);
    if (fromDiv) {
      Store.currentEmail = {
        senderEmail: fromDiv.getAttribute('email'),
        senderName: fromDiv.innerHTML
      };
      console.log(Store.currentEmail);
    }
  };

  var addAction = function() {
    chrome.runtime.sendMessage({
      action: 'POST',
      url: Store.server + '/actions',
      data: {
        type: 'email',
        company: 'test',
        description: 'my description',
        actionSource: 'user',
        completedTime: 'NOW',
        jobId: 1,
        userId: 1
      }
    }, function(res) {
      console.log(res);
    });
  };

  console.log('hello');
  return (
    <div>
      <div>Record email interaction:</div>
      <button onClick={grabEmail}>Grab current email</button>
      <div>{Store.currentEmail.senderName}</div>
      <div>{Store.currentEmail.senderEmail}</div>
      <button onClick={addAction}>Record email</button>
    </div>
  );
});

export default Emails;