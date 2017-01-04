import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import {observer} from 'mobx-react';

var Company = observer((props) => {
  return (
    <div>
      <div>{Store.company.name}</div>
      <div>{Store.company.location}</div>
      {Store.company.image && <img src={Store.company.image} />}
      <div>{Store.company.description}</div>
    </div>
  );
});

export default Company;