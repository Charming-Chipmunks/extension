import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './components/Sidebar.js';
import Store from './components/Store.js';
import utils from './changeViews.js';
import $ from 'jquery';

Date.prototype.toDateTime = function() {
  return this.toISOString().replace(/T/, ' ').slice(0, 19);
};

var insertWhenReady = function() {
  var emails = document.getElementsByClassName('Tm')[0];
  if (emails) {
    var div = document.createElement('div');
    div.id = 'ext';
    div.className = 'sidebar-max-width';
    var spacer = document.createElement('spacer');
    spacer.id = 'spacer';
    spacer.className = 'sidebar-max-width';
    emails.before(spacer);
    emails.before(div);
    ReactDOM.render(<Sidebar />, document.getElementById('ext'));
  } else {
    setTimeout(insertWhenReady, 100);
  }
};

insertWhenReady();

var detectLoad = function() {
  var loading = document.getElementById('loading');
  if (loading.getAttribute('style') !== 'display: none;') {
    setTimeout(detectLoad, 100);
  } else {
    var table = document.getElementsByClassName('zt')[0];
    var fromDiv = document.getElementsByClassName('gD')[0];
    if (table) {
      utils.addTableRowListeners();
    } else if (fromDiv) {
      utils.openEmail();
    }
  }
};

detectLoad();

setTimeout(() => {
  
}, 10000);