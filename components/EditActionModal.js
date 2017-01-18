import React from 'react';
import ReactDOM from 'react-dom';

import Store from './Store.js';
import mobx from 'mobx';
import {observer} from 'mobx-react';
import Modal from './Modal.js';
import DayPicker, { DateUtils } from 'react-day-picker';

@observer class EditActionsModal extends React.Component {
  constructor(props) {
    super(props)
    this.saveDate = this.saveDate.bind(this);
  }

  saveDate() {
    console.log('hi');
  }

  render() {
    return (
      <Modal>
        <DayPicker onDayClick={ this.saveDate }/>
      </Modal>
    ); 
  }
};

export default EditActionsModal;