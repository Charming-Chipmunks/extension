import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import mobx from 'mobx';
import {observer} from 'mobx-react';

var History = observer((props) => {
  var history = Store.job.history.slice().map(record => mobx.toJS(record));
  var now = new Date();
  var emailIcon = 'https://puu.sh/t6VbF/f01ab2fd8e.png';
  var phoneIcon = 'https://puu.sh/t6VwW/ab509518d2.png';

  var markCompleted = function(record) {
    //TODO: update database
    var i = history.indexOf(record);
    var newTask = Object.create(record);
    newTask.completedTime = new Date().toISOString().slice(0, 19).replace(/T/, ' ');
    Store.job.history[i] = newTask;
  };

  return (
    <div>
      <div>{Store.job.companyName}</div>
      <div>{Store.job.positionName}</div>
      <hr />
      <div>Tasks:</div><br />
      <div>
        {history.filter(record => record.actionType === 'recommendation' && !record.completedTime).map((record, i) => {
          if (record.completedTime) {
            var taskStatus = 'task-completed';
          } else {
            if (new Date(record.scheduledTime) < now ) {
              var taskStatus = 'task-overdue';
            } else {
              var taskStatus = 'task-pending';
            }
          }

          if (record.action === 'email') {
            var taskIcon = emailIcon;
          } else if (record.action === 'phone') {
            var taskIcon = phoneIcon;
          } 

          return (
            <div key={i} className={taskStatus}>
              <img src={taskIcon} />
              {!record.completedTime && record.scheduledTime && <div>Do by {record.scheduledTime}</div>}
              {record.completedTime && <div>Completed at {record.completedTime}</div>}
              <div>{record.action}</div>
              <div>{record.actionDetails}</div>
              {!record.completedTime && <button onClick={() => markCompleted(record)}>Mark as Done</button>}
              <hr />
            </div>
          );
        })}
      </div>
      <div>History:</div><br />
      <div>
        {history.filter(record => record.actionType === 'userInteraction' || (record.actionType === 'recommendation' && record.completedTime)).sort((a, b) => a.completedTime >= b.completedTime ? 1 : 0).map((record, i) => {
          if (record.action === 'email') {
            var taskIcon = emailIcon;
          } else if (record.action === 'phone') {
            var taskIcon = phoneIcon;
          } 

          return (
            <div key={i}>
              <img src={taskIcon} />
              <div>Completed at {record.completedTime}</div>
              <div>{record.action}</div>
              <div>{record.actionDetails}</div>
              <hr />
            </div>
          )
        })}
      </div>
    </div>
  );
});

export default History;