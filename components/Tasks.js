import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import mobx from 'mobx';
import {observer} from 'mobx-react';

var Tasks = observer((props) => {
  console.log('my tasks');
  var tasks = Store.tasks.slice().map(record => mobx.toJS(record));
  var now = new Date();
  var emailIcon = 'https://puu.sh/t6VbF/f01ab2fd8e.png';
  var phoneIcon = 'https://puu.sh/t6VwW/ab509518d2.png';

  var markCompleted = function(record) {
    //TODO: update database
    var i = tasks.indexOf(record);
    var newTask = Object.create(record);
    newTask.completedTime = new Date().toISOString().slice(0, 19).replace(/T/, ' ');
    Store.tasks[i] = newTask;


    chrome.runtime.sendMessage({
      action: 'PUT',
      url: Store.server + '/actions/' + Store.userId + '/' + record.id
    }, function(res) {
      console.log(res);
    });
  };

  return (
    <div>
      <div>TODO:</div><br />
      <div>
        {tasks.filter(record => /*record.actionType === 'recommendation' &&*/ !record.completedTime).map((record, i) => {
          if (new Date(record.scheduledTime) < now ) {
            var taskStatus = 'task-overdue';
          } else {
            var taskStatus = 'task-pending';
          }

          if (record.action === 'email') {
            var taskIcon = emailIcon;
          } else if (record.action === 'phone') {
            var taskIcon = phoneIcon;
          }

          return (
            <div key={i} className={taskStatus}>
              <img src={taskIcon} />
              <div>{record.company}</div>
              <div>{record.description}</div>
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
    </div>
  );
});

export default Tasks;