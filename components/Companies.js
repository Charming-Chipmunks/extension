import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import mobx from 'mobx';
import {observer} from 'mobx-react';
import Action from './Action.js';

var Tasks = observer((props) => {
  var jobs = Store.jobs.slice().map(record => mobx.toJS(record));

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