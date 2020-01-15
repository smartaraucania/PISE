import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import ArgonDashboard from './plugins/argon-dashboard'
import moment from 'moment'
var constants = require('./constants');

moment.locale("es");

Vue.prototype.$moment = moment;

Vue.config.productionTip = false

import vSelect from 'vue-select'
Vue.component('v-select', vSelect)

import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: constants.google_key,
    libraries: 'places'
  }
})

import Notifications from './components/NotificationPlugin'
Vue.use(Notifications)

Vue.mixin({
  methods:{
    notify(msg, icon, type) {
      if(!icon){
        if(type == "success") icon = "fa fa-thumbs-up";
        else if(type == "info") icon = "fa fa-info-circle";
        else if(type == "danger" || type == "warning") icon = "fa fa-exclamation";
      }
      this.$notify({
        message: msg,
        icon: icon,
        horizontalAlign: "right",
        verticalAlign: "top",
        type: type
      });
    },
    playSound (sound) {
      if(sound) {
        var audio = new Audio(sound);
        audio.play();
      }
    }
  }
})

import Vuex from "vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    emergencies: null,
    emergenciesIdViewed: [],
  },
  mutations: {
    setEmergenciesIdViewed(state, emergencyId) {
      state.emergenciesIdViewed = emergencyId;
    },
    addEmergenciesIdViewed(state, id) {
      state.emergenciesIdViewed.push(id);
    },
    setEmergencies(state, emergencies) {
      state.emergencies = emergencies;
    },
  },
  getters: {
    getEmergenciesIdViewed: state => {
      return state.emergenciesIdViewed;
    },
    getEmergencies: state => {
      return state.emergencies;
    }
  }
});

Vue.prototype.$store = store;

const emergenciesIdViewed = localStorage.getItem(
  "emergenciesIdViewed"
);
if (emergenciesIdViewed != null) {
  store.commit(
    "setEmergenciesIdViewed",
    JSON.parse(emergenciesIdViewed)
  );
}

import io2 from "socket.io-client";

var socket = io2(constants.host + ":"+constants.backend_port);
Vue.prototype.$socket = socket;

Vue.use(ArgonDashboard)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')