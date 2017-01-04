//MobX Store
import { autorun, action, extendObservable } from 'mobx';

class Store {
  constructor() {
    extendObservable(this, {
      currentUser: 'my user',

      currentTab: 'company',

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
          name: 'Sandy Knox',
          email: 'sandyk@airbnb.com'
        }, {
          name: 'Knox Sandy',
          email: 'knoxs@airbnb.com'
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
      user: {}
    });
  }
}

const store = window.store = new Store();

export default store;
