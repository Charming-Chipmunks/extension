//MobX Store
// import { autorun, action, extendObservable } from 'mobx';
import { extendObservable } from 'mobx';

class Store {
  constructor() {
    extendObservable(this, {
      // server: 'http://jobz.mooo.com:3000',
      server: 'http://jobz.mooo.com:3000',
      currentUserObject: {},
      currentUser: 'my user',
      userId: '',

      collapsed: false,

      token: '',

      tableRowListenersEnabled: false,

      currentTab: 'tasks',

      currentEmail: {},

      currentContact: {},

      currentJobTasks: [],

      currentJobContacts: [],

      jobs: [],
      jobsLookupById: {},
      jobsLookup: {},

      params: {
        c: false,
        python: false,
        javascript: true,
        node: true,
        react: false,
        angular: true,
        city: 'San Francisco',
        State: 'CA'
      },

      companyList: [{name: 'Airbnb'}, {name: 'SomeOtherCompany'}],

      company: {
        name: 'Airbnb',
        location: '888 Brannan St, San Francisco, CA 94103',
        description: 'Airbnb helps people find great rooms to stay in.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL9k4sQZ4ymvxo9eUdLmJYdTOWlRmIPP0ZsDNVvmJ7Eh_cmi-Dlt5J6aM'
      },
      contacts: [
        {
          id: 1,
          companyId: 1,
          name: 'Sandy Knox',
          email: 'sandyk@airbnb.com'
        }, {
          id: 2,
          companyId: 1,
          name: 'Knox Sandy',
          email: 'knoxs@airbnb.com'
        },
        {
          id: 3,
          companyId: 2,
          name: 'Erik',
          email: 'communication@hackreactor.com'
        }
      ],
      job: {
        companyName: 'Airbnb',
        positionName: 'Javascript Developer',
        details: 'A leading customer engagement platform here in downtown San Francisco is looking to add a Frontend Engineer to their growing team.',
        history: [{
          scheduledTime: '2016-12-25 11:30:30',
          completedTime: '2016-12-25 11:30:30',
          action: 'email',
          actionType: 'userInteraction',
          actionDetails: 'Email received from DONE',
        }, {
          scheduledTime: '2017-01-11 13:30:30',
          completedTime: null,
          action: 'phone',
          actionType: 'recommendation',
          actionDetails: 'Send a reply to TODO'
        }, {
          scheduledTime: '2016-12-26 16:30:30',
          completedTime: null,
          action: 'email',
          actionType: 'recommendation',
          actionDetails: 'Send a reply to OVERDUE'
        }]
      },
      user: {},
      tasks: [],
    });
  }
}

const store = window.store = new Store();

export default store;
