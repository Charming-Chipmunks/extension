//MobX Store
// import { autorun, action, extendObservable } from 'mobx';
import { extendObservable } from 'mobx';

class Store {
  constructor() {
    extendObservable(this, {
      // server: 'http://jobz.mooo.com:3000',
      server: 'http://127.0.0.1:3000',
      currentUserObject: {},
      currentUser: 'my user',
      userId: '',

      token: '',
      tableRowListenersEnabled: false,

      collapsed: false,
      googlePage: '',
      currentTab: 'tasks',

      currentEmail: {},

      currentContact: {},
      currentJobTasks: [],
      currentJobContacts: [],

      contacts: {},
      jobTasks: {},
      jobContacts: {},

      jobs: [],
      jobsLookupById: {},
      jobsLookup: {},

      user: {},
      tasks: []
    });
  }
}

export default new Store();
