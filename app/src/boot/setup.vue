<template>
  <view class="container">
    <app-loading v-if="!isAppReady"> </app-loading>
    <app v-if="isAppReady"></app>
  </view>
</template>

<script>
import Vue from "vue-native-core";
import { VueNativeBase } from "native-base";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { AsyncStorage } from "react-native";

import Vuex from "vuex";
Vue.use(Vuex);

import App from "../App.vue";
import moment from "moment";
require('moment/locale/es.js');
moment.locale("es");
Vue.prototype.$moment = moment;

// registering all native-base components to the global scope of the Vue
Vue.use(VueNativeBase);

const store = new Vuex.Store({
  state: {
    emergencies: null,
    emergenciesIdViewed: [],
    emergenciesWithoutRead: 0,
  },
  mutations: {
    setEmergenciesIdViewed(state, emergencyId) {
      state.emergenciesIdViewed = emergencyId;
    },
    addEmergencyIdViewed(state, id) {
      state.emergenciesIdViewed.push(id);
    },
    setEmergencies(state, emergencies) {
      state.emergencies = emergencies;
    },
    incrementEmergenciesWithoutRead (state){
      state.emergenciesWithoutRead++;
    },
    decrementEmergenciesWithoutRead (state){
      state.emergenciesWithoutRead--;
    }
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

export default {
  components: { App, AppLoading },
  data() {
    return {
      isAppReady: false
    };
  },
  created() {
    this.loadFonts();
  },
  methods: {
    async loadFonts() {
      try {
        this.isAppReady = false;
        await Font.loadAsync({
          Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf"),
          Ionicons: require("../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf")
        });
        Vue.prototype.$token = await AsyncStorage.getItem('token');
        const emergenciesIdViewed = await AsyncStorage.getItem("emergenciesIdViewed");
        if (emergenciesIdViewed != null) {
          this.$store.commit("setEmergenciesIdViewed", JSON.parse(emergenciesIdViewed));
        }
        this.isAppReady = true;
      } catch (error) {
        console.log("some error occured", error);
        this.isAppReady = true;
      }
    }
  }
};
</script>

<style>
.container {
  flex: 1;
}
</style>
