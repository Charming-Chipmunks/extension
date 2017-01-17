import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import mobx from 'mobx';
import {observer} from 'mobx-react';
import Action from './Action.js';

var Tasks = observer((props) => {
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
      url: Store.server + '/actions/' + Store.userId + '/' + record.id,
      token: Store.token
    }, function(res) {
    });
  };

  return (
    <div>
      <div>TODO:</div><br />
      <div className='task-list y-scroll'>
        {tasks.filter(record => /*record.actionType === 'recommendation' &&*/ !record.completedTime).map((record, i) => <Action action={record} completed={markCompleted}key={i} />)}
      </div>
    </div>
  );
});

export default Tasks;