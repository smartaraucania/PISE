<template>
  <nb-container :style="{ backgroundColor: '#fff' }">

    <nb-content padder v-if="emergenciasTab" :refreshControl="refreshEmergencias()">
      <view v-if="isLoading" :style="{alignItems: 'center', justifyContent: 'center'}">
        <activity-indicator size="large" color="green" />
        <nb-text>Obteniendo Emergencias</nb-text>
      </view>
      <Emergencias v-else :is="Emergencias" :emergencies="emergencias" :navigation="navigation"></Emergencias>
    </nb-content>

    <nb-content padder v-if="activasTab" :refreshControl="refreshActivas()">
      <view v-if="isLoading" :style="{alignItems: 'center', justifyContent: 'center'}">
        <activity-indicator size="large" color="green" />
        <nb-text>Obteniendo Emergencias Activas</nb-text>
      </view>
      <Activas v-else :is="Activas" :activas="activas" :navigation="navigation"></Activas>
    </nb-content>

    <nb-content padder v-if="usuarioTab">
      <view v-if="isLoading" :style="{alignItems: 'center', justifyContent: 'center'}">
        <activity-indicator size="large" color="green" />
        <nb-text>Obteniendo Datos de Usuario</nb-text>
      </view>
      <Usuario v-else :is="Usuario"></Usuario>
    </nb-content>

    <nb-footer>
      <nb-footer-tab>
        <nb-button :active="emergenciasTab" :onPress="toggleEmergenciasTab" vertical badge>
          <nb-badge>
            <nb-text>{{cantEmergenciesWithoutRead}}</nb-text>
          </nb-badge>
          <nb-icon name="clipboard" :active="emergenciasTab" />
          <nb-text>Emergencias</nb-text>
        </nb-button>

        <nb-button :active="activasTab" :onPress="toggleActivasTab" vertical badge>
          <nb-badge>
            <nb-text>{{(cantEmergenciasActivas < 1 ? 0 : cantEmergenciasActivas)}}</nb-text>
          </nb-badge>
          <nb-icon name="pulse" :active="activasTab" />
          <nb-text>Activas</nb-text>
        </nb-button>

        <nb-button :active="usuarioTab" :onPress="toggleUsuarioTab">
          <nb-icon name="person" :active="usuarioTab" />
          <nb-text>Usuario</nb-text>
        </nb-button>
      </nb-footer-tab>
    </nb-footer>
  </nb-container>
</template>

<script>
import React from "react";
import {
  Dimensions,
  Platform,
  AsyncStorage,
  RefreshControl
} from "react-native";
import { Icon } from "native-base";

import { emergencyService, authService } from "../services";
import Emergencias from "./contentTabs/Emergencias.vue";
import Activas from "./contentTabs/Activas.vue";
import Usuario from "./contentTabs/Usuario.vue";

export default {
  props: {
    navigation: {
      type: Object
    }
  },
  components: {
    Emergencias,
    Activas,
    Usuario
  },
  data() {
    return {
      isLoading: false,
      stylesObj: {
        loadingContainerStyle: {
          marginTop: Dimensions.get("window").height / 8
        }
      },
      emergenciesIdViewed: [],
      emergenciasTab: false,
      activasTab: true,
      usuarioTab: false,
      activas: [],
      isRefreshing: false,
      cantEmergenciasActivas: 0
    };
  },
  async created(){
      this.getEmergencias();
      this.getActivas();
      this.getCantActivas();
      await authService.me().then(async res => {
        await AsyncStorage.setItem('user', JSON.stringify(res.user));
      }).catch(err => {
      });
  },
  computed: {
    cantEmergenciesWithoutRead(){
      return this.$store.state.emergenciesWithoutRead;
    }
  },
  methods: {
    //TOGGLE TABS
    toggleEmergenciasTab() {
      if(this.isLoading) return;
      this.emergenciasTab = true;
      this.activasTab = false;
      this.usuarioTab = false;
    },
    toggleActivasTab() {
      if(this.isLoading) return;
      this.emergenciasTab = false;
      this.activasTab = true;
      this.tab3 = false;
    },
    toggleUsuarioTab() {
      if(this.isLoading) return;
      this.emergenciasTab = false;
      this.activasTab = false;
      this.usuarioTab = true;
    },
    //GET'S
    getEmergencias() {
      this.isLoading = true;
      emergencyService
        .getAllByUserLogged(1, null)
        .then(async response => {
          this.$store.commit("setEmergencies", response.response);
          this.emergencias = this.$store.getters.getEmergencies;
          this.emergenciesIdViewed = this.$store.getters.getEmergenciesIdViewed;
          if (this.emergenciesIdViewed == null) this.emergenciesIdViewed = [];
          this.emergencias.forEach(emergencia => {
            if (this.emergenciesIdViewed.indexOf(emergencia._id) == -1) {
              emergencia.isNew = true;
              this.$store.commit("incrementEmergenciesWithoutRead");
            }
          });
          await AsyncStorage.setItem('emergenciesIdViewed', JSON.stringify(this.emergenciesIdViewed));
          this.isLoading = false;
          this.isRefreshing = false;
        })
        .catch(response => {
          this.emergencias = [];
          this.isLoading = false;
        });
    },
    getActivas: function() {
        this.isLoading = true;
      emergencyService
        .getAllByUserLogged(1, false)
        .then(async response => {
          this.$store.commit("setEmergencies", response.response);
          this.activas = this.$store.getters.getEmergencies;
          this.emergenciesIdViewed = this.$store.getters.getEmergenciesIdViewed;
          if (this.emergenciesIdViewed == null) this.emergenciesIdViewed = [];
          this.activas.forEach(emergencia => {
            if (this.emergenciesIdViewed.indexOf(emergencia._id) == -1) {
              emergencia.isNew = true;
            }
          });
          await AsyncStorage.setItem('emergenciesIdViewed', JSON.stringify(this.emergenciesIdViewed));
          this.isLoading = false;
          this.getCantActivas();
        })
        .catch(response => {
          this.activas = [];
          this.isLoading = false;
        });
    },
    getCantActivas(){
      this.isLoading = true;
      emergencyService.getCantActiveEmergencies().then(res => {
        this.cantEmergenciasActivas = res.activeEmergencies;
        this.isLoading = false;
      }).catch(err => {
        this.cantEmergenciasActivas = "?";
        this.isLoading = false;
      });
    },

    refreshEmergencias: function() {
      return (
        <RefreshControl
          refreshing={this.isRefreshing}
          onRefresh={this.getEmergencias}
        />
      );
    },
    refreshActivas: function() {
      return (
        <RefreshControl
          refreshing={this.isRefreshing}
          onRefresh={this.getActivas}
        />
      );
    }
  }
};
</script>

<style>
.badge-3-bg {
  background-color: green;
}
</style>
