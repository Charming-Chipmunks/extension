import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import mobx from 'mobx';
import {observer} from 'mobx-react';
import Action from './Action.js';

var Tasks = observer((props) => {
  var jobs = Store.jobs.slice().map(record => mobx.toJS(record));
  var now = new Date();

  // var markCompleted = function(record) {
  //   //TODO: update database
  //   var i = tasks.indexOf(record);
  //   var newTask = Object.create(record);
  //   newTask.completedTime = new Date().toISOString().slice(0, 19).replace(/T/, ' ');
  //   //Store.tasks[i] = newTask;

  //   chrome.runtime.sendMessage({
  //     action: 'PUT',
  //     url: Store.server + '/actions/' + Store.userId + '/' + record.id,
  //     token: Store.token
  //   }, function(res) {
  //   });
  // };

  return (
    <div>
      <div>Companies:</div><br />
      <div className='y-scroll'>
        {jobs
          .map((record, i) => <div key={i}>{record.company}: {record.jobTitle} ({record.UserJob.progress})</div>)
        }
      </div>
    </div>
  );
});

export default Tasks;