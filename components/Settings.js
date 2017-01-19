import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import mobx from 'mobx';
import {observer} from 'mobx-react';
import Action from './Action.js';

var Settings = observer((props) => {
  return (
    <div className='settings'>
      <br />
      <div>Logged in as {Store.currentUser}</div>
      <br />
      <a href='#' onClick={() => {
        Store.token = '';
        Store.userId = '';
        Store.currentUser = '';
        Store.currentUserObject = '';
      }}>Log Out</a>
      <br />
      <br />
      <a href='http://jobz.mooo.com:3000' target='_blank'>Visit full site</a>
    </div>
  );
});

export default Settings;