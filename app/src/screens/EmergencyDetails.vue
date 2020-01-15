<template>
  <nb-container :style="{ backgroundColor: '#fff' }">
    <nb-header>
      <nb-left>
        <nb-button transparent :onPress="() => this.props.navigation.goBack()">
          <nb-icon name="arrow-back" />
        </nb-button>
      </nb-left>
      <nb-body>
        <nb-title>Detalles emergencia</nb-title>
      </nb-body>
    </nb-header>
    <nb-content padder>
      <view v-if="isLoading" :style="{alignItems: 'center', justifyContent: 'center'}">
        <activity-indicator size="large" color="green" />
        <nb-text>Actualizando</nb-text>
      </view>
      <nb-grid v-else>
        <nb-row>
          <nb-text
            class="title"
          >{{ emergency.emergencyType_id.name }} {{emergency.emergencyType_id.description.toUpperCase()}}</nb-text>
        </nb-row>
        <nb-row>
          <nb-text class="date">&#xA;</nb-text>
        </nb-row>
        <nb-row :size="1">
          <nb-text class="title">{{ emergency.actorType_id.name.toUpperCase() }}</nb-text>
        </nb-row>
        <nb-row :size="1">
          <nb-text class="date">{{ $moment(emergency.date).format('DD MMM YYYY HH:mm') }}</nb-text>
        </nb-row>
        <nb-row>
          <nb-text class="date">&#xA;</nb-text>
        </nb-row>

        <nb-row :size="1">
          <nb-text class="event">
            {{emergency.lastEvent
            ? emergency.lastEvent.eventType_id.name.toUpperCase() +
            " por " +
            emergency.lastEvent.user
            : "CREADA"}}
          </nb-text>
        </nb-row>
        <nb-row>
          <nb-text class="date">&#xA;</nb-text>
        </nb-row>
        <nb-row
          :size="1"
          :style="{alignItems: 'center', justifyContent: 'center', marginBottom: 5}"
        >
          <nb-text class="address">{{ emergency.address }}</nb-text>
        </nb-row>
        <nb-row>
          <map-view :style="{width: w, height:h}" :initial-region="coordinates">
            <map-marker :coordinate="coordinates" :title="emergency.emergencyType_id.name" :description="emergency.address"></map-marker>
          </map-view>
        </nb-row>
      </nb-grid>
    </nb-content>
    <nb-footer>
      <nb-footer-tab>
        <nb-button active full :onPress="accionesButton">
          <nb-text>Acciones</nb-text>
        </nb-button>
      </nb-footer-tab>
    </nb-footer>
  </nb-container>
</template>
<style>
.title {
  color: black;
  font-size: 14;
  font-weight: bold;
}
.subtitle {
  color: black;
  font-size: 12;
}
.event {
  font-weight: bold;
  color: black;
  font-size: 12;
}
.container {
  flex: 1;
}
.date {
  text-align: right;
  font-size: 14;
}
.address {
  font-size: 16;
}
</style>

<script>
import MapView from "react-native-maps";
import React, { Component } from "react";
import { Dimensions, AsyncStorage, RefreshControl, Alert } from "react-native";
import { ActionSheet, Toast } from "native-base";
import { emergencyService } from "../services";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

export default {
  props: {
    navigation: {
      type: Object
    }
  },
  components: {
    MapView,
    MapMarker: MapView.Marker
  },
  data() {
    return {
      location: null,
      emergency: null,
      w: Dimensions.get("window").width,
      h: Dimensions.get("window").height / 2,
      coordinates: {
        latitude: null,
        longitude: null,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003
      },
      stringConfirmar: "Confirmar 'En camino'",
      stringConfirmarLlegada: "Confirmar 'Llegada al lugar'",
      btnOptions: [
        "Ver reporte inicial",
        "Confirmar 'En camino'",
        "Solicitar ayuda",
        "Cancelar"
      ],
      optionCancelIndex: 3,
      clicked: 0,
      user: null,
      isLoading: true
    };
  },
  beforeCreate() {},
  async created() {
    var { params } = this.navigation.state;
    this.emergency = params.emergency;
    await this.checkEmergency();
    var emergenciesIdViewed = this.$store.getters.getEmergenciesIdViewed;
    emergenciesIdViewed.push(this.emergency._id);
    await AsyncStorage.setItem('emergenciesIdViewed', JSON.stringify(emergenciesIdViewed));
    this.isLoading = false;
  },
  methods: {
    accionesButton() {
      ActionSheet.show(
        {
          options: this.btnOptions,
          cancelButtonIndex: this.optionCancelIndex,
          title: "Selecciona una acción"
        },
        async buttonIndex => {
          switch (buttonIndex) {
            case 0:
              this.navigation.navigate("InitialReport", {emergency: this.emergency})
              break;
            case 1:
              
              if (
                this.user &&
                this.emergency.confirmAppUsers_id.indexOf(this.user._id) == -1
              ) {
                this.isLoading = true;
                emergencyService
                  .notifyRoadToEmergency(this.emergency._id)
                  .then(res => {
                    emergencyService
                      .getById(this.emergency._id)
                      .then(res => {
                        this.emergency = res.response;
                        this.checkEmergency();
                        this.isLoading = false;
                      })
                      .catch(err => {
                        Toast.show({
                          text: err[0].error,
                          buttonText: "Ok",
                          duration: 5000
                        });
                        this.isLoading = false;
                      });
                  })
                  .catch(err => {
                    Toast.show({
                      text: err[0].error,
                      buttonText: "Ok",
                      duration: 5000
                    });
                    this.isLoading = false;
                  });
              } else {
                if (
                  this.user &&
                  this.emergency.arrivedAppUsers_id.indexOf(this.user._id) == -1
                ) {
                  Alert.alert(
                    "AVISO",
                    "Eres el primero en llegar. ¿Deseas actualizar la ubicación?",
                    [
                      {
                        text: "No",
                        onPress: () => this.arrivedLocation(false),
                        style: "cancel"
                      },
                      {
                        text: "Actualizar Ubicación",
                        onPress: () => this.arrivedLocation(true)
                      }
                    ],
                    { cancelable: false }
                  );
                }
              }
              break;
            case 2:
              alert("Pronto");
              break;
          }
        }
      );
    },
    async arrivedLocation(getLocation) {
      this.isLoading = true;
      if (getLocation) {
        await this.getLocation();
      } else {
        this.location = {
          lat: null,
          lng: null
        }
      }

      emergencyService
        .notifyArrived(this.emergency._id, this.location)
        .then(res => {
          emergencyService
            .getById(this.emergency._id)
            .then(res => {
              this.emergency = res.response;
              this.checkEmergency();
              this.isLoading = false;
            })
            .catch(err => {
              Toast.show({
                text: err[0].error,
                buttonText: "Ok",
                duration: 5000
              });
              this.isLoading = false;
            });
        })
        .catch(err => {
          Toast.show({
            text: err[0].error,
            buttonText: "Ok",
            duration: 5000
          });
          this.isLoading = false;
        });
    },
    async getLocation() {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        Toast.show({
          text: "No tenemos permisos para obtener tu ubicación",
          buttonText: "Ok",
          duration: 5000
        });
      }

      let location = await Location.getCurrentPositionAsync({});
      this.location = {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      }
    },
    async checkEmergency() {
      this.coordinates.latitude = this.emergency.location.lat;
      this.coordinates.longitude = this.emergency.location.lng;
      this.user = JSON.parse(await AsyncStorage.getItem("user", null));
      if (
        this.user &&
        this.emergency.confirmAppUsers_id.indexOf(this.user._id) == -1
      ) {
        this.btnOptions[1] = this.stringConfirmar;
      } else {
        this.btnOptions[1] = this.stringConfirmarLlegada;
      }
      if (
        this.user &&
        this.emergency.arrivedAppUsers_id.indexOf(this.user._id) == -1
      ) {
        this.btnOptions[1] = this.stringConfirmarLlegada;
      } else {
        this.btnOptions[1] = "USTED YA CONFIRMO SU LLEGADA";
      }
    }
  }
};
</script>