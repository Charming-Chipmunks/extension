import React from 'react';
import ReactDOM from 'react-dom';

var Modal = (props) => {
  var click = (e) => {
    if (e.target.className.indexOf('side-overlay') > -1) {
      if (props.cb) {
        props.cb(e);
      }
      e.target.remove();
    }
  };

  return (
    <div className='side-overlay' onClick={click}>
      <div className='xy-center side-modal-container' onClick={(e) => {
        e.preventDefault();
        return false;
      }}>
        {props.children}
      </div>
    </div>
  );
};

export default Modal;