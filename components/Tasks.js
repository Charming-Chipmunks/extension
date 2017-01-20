import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import mobx from 'mobx';
import {observer} from 'mobx-react';
import Action from './Action.js';

var Tasks = observer((props) => {
  var tasks = Store.tasks.slice().map(record => mobx.toJS(record));
  var now = new Date();

  var markCompleted = function(record) {
    var i = tasks.indexOf(record);
    var newTask = Object.create(record);
    newTask.completedTime = new Date().toISOString().slice(0, 19).replace(/T/, ' ');
    Store.tasks[i] = newTask;

    chrome.runtime.sendMessage({
      action: 'PUT',
      url: Store.server + '/actions/' + Store.userId + '/' + record.id,
      token: Store.token
    }, function(res) {
      chrome.runtime.sendMessage({
        action: 'GET',
        url: Store.server + '/actions/' + Store.userId,
        token: Store.token
      }, function(res) {
        if (res.err) {
          alert('error:' + res.err);
        } else {
          Store.tasks = res.data;
        }
      });
    });
  };

  return (
    <div>
      <div>TODO:</div><br />
      <div className='task-list y-scroll'>
        {tasks
          .filter(record => !record.completedTime)
          .sort((a, b) => a.scheduledTime < b.scheduledTime ? -1 : 1) 
          .map((record, i) => <Action action={record} completed={markCompleted}key={i} />)
        }
      </div>
    </div>
  );
});

export default Tasks;