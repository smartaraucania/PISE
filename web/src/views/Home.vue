<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
      <!-- Card stats -->
      <div class="row justify-content-center">
        <div class="col-xl-3 col-m-5 col-lg-6">
          <stats-card
            title="Total de Emergencias Este Mes"
            type="gradient-red"
            :sub-title="totalEmergenciasMes+''"
            icon="fa fa-line-chart"
            class="mb-4 mb-xl-0"
          >
            <template slot="footer" v-if="true">
              <span class="text-success mr-2">
                <i :class="claseIconoEmergenciasHoy"></i>
                {{totalEmergenciasHoy}}
              </span>
              <span class="text-nowrap">Hoy</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Emergencias Activas"
            type="gradient-orange"
            :sub-title="emergenciasActivas"
            icon="fa fa-bullhorn"
            class="mb-4 mb-xl-0"
          >
            <template slot="footer" v-if="true">
              <span class="text-success mr-2"></span>
              <span class="text-nowrap"></span>
            </template>
          </stats-card>
        </div>
      </div>
      <br />
      <div class="row justify-content-center" v-if="$loggedUser.isSuperUser">
        <div class="col-xl-3 col-lg-6">
          <base-button
            block
            type="warning"
            icon="ni ni-ambulance"
            @click="mostrarAgregarEmergencia()"
          >Agregar Emergencia</base-button>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <!--Tables-->
        <div class="col">
          <lastEmergencies-table :tableData="emergencies" :error="emergenciesError"></lastEmergencies-table>
        </div>
      </div>
      <!--End tables-->
    </div>

    <!-- MODAL: AGREGAR EMERGENCIA -->
    <div class="col-md-4">
      <modal
        :closeInBackground="false"
        :show.sync="agregarEmergenciaModal"
        body-classes="p-0"
        modal-classes="modal-dialog-centered modal-xl"
      >
        <card
          type="secondary"
          shadow
          header-classes="bg-white pb-5"
          body-classes="px-lg-5 py-lg-5"
          class="border-0"
        >
          <template>
            <div class="text-center mb-3">
              <h2>Agregar Emergencia</h2>
            </div>
          </template>
          <template>
            <form>
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label for="emergencyType">
                      <h4>Tipo de Emergencia</h4>
                    </label>
                    <v-select
                      id="emergencyType"
                      v-model="emergencyTypeSelected"
                      :options="emergencyTypes"
                      label="name"
                      :required="!emergencyTypeSelected"
                      :placeholder="'Seleciona un tipo de emergencia'"
                    >
                      <template slot="option" slot-scope="option">{{ option.name.toUpperCase() }}</template>
                      <template
                        slot="selected-option"
                        slot-scope="option"
                      >{{ option.name.toUpperCase() }}</template>
                      <span slot="no-options">No encontrado.</span>
                    </v-select>
                    <span
                      class="text-muted"
                    >{{ emergencyTypeSelected ? emergencyTypeSelected.description.toUpperCase() : ''}}</span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label for="address">
                      <h4>Direccion</h4>
                    </label>
                    <gmap-autocomplete
                      id="address"
                      placeholder="Dirección o lugar"
                      required
                      class="input-group-text form-control text-black"
                      @place_changed="setPlace"
                    ></gmap-autocomplete>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <gmap-map
                    v-on:click="mapClick"
                    :center="geolocation"
                    :zoom="zoom"
                    :options="{scrollwheel: true}"
                    style="width:100%;  height: 400px;"
                  >
                    <gmap-marker
                      :position="marker.position"
                      @click="emergencyModel.location=marker.position"
                    ></gmap-marker>
                  </gmap-map>
                </div>
              </div>
              <br />
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label for="details">
                      <h4>Detalles</h4>
                    </label>
                    <textarea
                      class="form-control"
                      rows="3"
                      placeholder="Detalle de la emergencia"
                      v-model="emergencyModel.details"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label for="details">
                      <h4>Fecha</h4>
                    </label>
                    <base-input addon-left-icon="ni ni-calendar-grid-58">
                      <flat-picker
                        id="date"
                        slot-scope="{focus, blur}"
                        @on-open="focus"
                        @on-close="blur"
                        :config="config"
                        class="form-control datepicker"
                        v-model="emergencyModel.date"
                      ></flat-picker>
                    </base-input>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <base-button
                  type="plain"
                  class="my-4"
                  @click="confirmarCancelarModal = true"
                >Cancelar</base-button>
                <base-button type="success" class="my-4" @click="addEmergency">Agregar Emergencia</base-button>
              </div>
            </form>
          </template>
        </card>
      </modal>

      <div class="col-md-4">
        <modal
          :show.sync="confirmarCancelarModal"
          gradient="danger"
          modal-classes="modal-danger modal-dialog-centered"
        >
          <h6
            slot="header"
            class="modal-title"
            id="modal-title-notification"
          >Confirma la siguiente acción</h6>

          <div class="py-3 text-center">
            <i class="fa fa-exclamation-triangle ni-3x"></i>
            <h4 class="heading mt-4">Cuidado!</h4>
            <p>¿Desea cancelar la acción y perder todos los cambios?</p>
          </div>

          <template slot="footer">
            <base-button type="white" @click="confirmarCancelar">Si, cancelar</base-button>
            <base-button
              type="link"
              text-color="white"
              class="ml-auto"
              @click="confirmarCancelarModal = false"
            >No</base-button>
          </template>
        </modal>
      </div>
    </div>
    <div class="vld-parent">
      <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></loading>
    </div>
  </div>
</template>
<style>
.text-black {
  color: black;
}

.modal-backdrop {
  z-index: 10;
}
​ .pac-container {
  background-color: #fff;
  z-index: 20;
  position: fixed;
  display: inline-block;
  float: left;
}
.modal {
  z-index: 20;
  overflow-y: auto;
}
</style>
<script>
// Tables
import LastEmergenciesTable from "./Tables/LastEmergenciesTable";
import "vue-select/dist/vue-select.css";
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { Spanish } from "flatpickr/dist/l10n/es.js"
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

import { utilsService, emergencyService } from "../services";

var autocomplete;
var marker;

var is = require("is_js");

const fp = flatpickr("#date", {}); // flatpickr

export default {
  components: {
    LastEmergenciesTable,
    flatPicker,
    Loading
  },
  data() {
    return {
      //MAPS
      geolocation: { lat: -38.73965, lng: -72.59842 },
      zoom: 13,
      marker: {},
      address: null,
      //YO
      config: { allowInput: true, dateFormat: "d-m-Y H:i", enableTime: true, locale: Spanish},
      isLoading: true,
      emergenciasActivas: "0",
      totalEmergenciasMes: "0",
      totalEmergenciasHoy: "0",
      claseIconoEmergenciasHoy: "",
      agregarEmergenciaModal: false,
      confirmarCancelarModal: false,
      emergencyTypes: [],
      emergencyTypeSelected: null,
      emergencies: {},
      emergenciesError: false,
      emergencyModel: {
        emergencyType_id: null,
        address: null,
        location: null,
        details: "",
        date: new Date()
      },
      page: 1
    };
  },
  async created() {
    if (this.$loggedUser.isAdmin) {
      this.$router.push({ name: "Administrar Usuarios Admin" });
      return;
    }
    await this.loadEmergencies();
    
    await emergencyService.getCantActiveEmergencies().then(res => {
      this.emergenciasActivas = res.activeEmergencies;
    }).catch(err => {
      this.emergenciasActivas = "Error al obtener el dato";
    });

    await emergencyService.getCantEmergenciesInCurrentMonth().then(res => {
      this.totalEmergenciasMes = res.totalMonthEmergencies;
    }).catch(err => {
      this.totalEmergenciasMes = "Error al obtener el dato";
    });

    await utilsService
      .getEmergencyTypesByActorType(this.$loggedUser.actorType)
      .then(res => {
        this.emergencyTypes = res.response;
      })
      .catch(res => {
        this.emergencyTypes = [];
      });
  },
  mounted() {
    if (this.totalEmergenciasHoy != 0) {
      this.claseIconoEmergenciasHoy = "fa fa-arrow-up";
    }
    this.$socket.on("askforhelp", async data => {
      if (data.to == this.$loggedUser.actorType) {
        this.notify(data.from + " ha solicitado su ayuda!", null, "warning");
        this.loadEmergencies();
      }
    });
  },
  methods: {
    mostrarAgregarEmergencia() {
      if(!is.edge()){
        this.$parent.$el.scrollTo(0, 0);
      }
      window.scrollTo(0, 0);
      this.agregarEmergenciaModal = true;
      this.emergencyModel.emergencyType_id = null;
      this.emergencyModel.address = null;
      this.emergencyModel.location = null;
      this.emergencyModel.details = null;
      this.emergencyModel.date = new Date();
    },
    confirmarCancelar() {
      this.agregarEmergenciaModal = false;
      this.confirmarCancelarModal = false;
      window.scrollTo(0, 0);
    },
    addEmergency() {
      this.isLoading = true;
      this.emergencyModel.address = document.getElementById("address").value;
      this.emergencyModel.emergencyType_id = this.emergencyTypeSelected
        ? this.emergencyTypeSelected._id
        : null;
      this.emergencyModel.date = flatpickr.parseDate(this.emergencyModel.date, "d-m-Y H:i");

      if(!this.emergencyModel.emergencyType_id) {
        this.notify(
            "Falta el tipo de emergencia",
            "fa fa-exclamation",
            "warning"
          );
          this.isLoading = false;
        return;
      }
      
      emergencyService
        .addEmergency(this.emergencyModel)
        .then(res => {
          this.loadEmergencies();
          this.agregarEmergenciaModal = false;
          this.notify(
            "Emergencia Agregada Correctamente",
            "fa fa-thumbs-up",
            "success"
          );
        })
        .catch(err => {
          this.isLoading = false;
          console.log(JSON.stringify(err));
          this.notify(
            "Ocurrio un error al agregar la emergencia: "+err[0].error,
            "fa fa-exclamation",
            "danger"
          );
        });
    },
    loadEmergencies() {
      this.isLoading = true;
      emergencyService
        .getAllByUserLogged(1, null)
        .then(async res => {
          this.emergencies = res;
          this.emergenciesError = false;
          this.isLoading = false;
          this.$store.commit("setEmergencies", res);
          this.emergencies = this.$store.getters.getEmergencies;
          this.emergenciesIdViewed = this.$store.getters.getEmergenciesIdViewed;
          if (this.emergenciesIdViewed == null) this.emergenciesIdViewed = [];
          this.emergencies.response.forEach(emergency => {
            if (this.emergenciesIdViewed.indexOf(emergency._id) == -1) {
              emergency.isNew = true;
            }
          });
          await localStorage.setItem('emergenciesIdViewed', JSON.stringify(this.emergenciesIdViewed));
        })
        .catch(err => {
          this.emergencies = {};
          this.emergenciesError = true;
          this.isLoading = false;
        });
    },
    setPlace(place) {
      const coords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      this.zoom = 14;
      this.addMarker(coords);
      this.geolocation = coords;
    },
    addMarker(coords) {
      this.marker = {
        position: {
          lat: coords.lat,
          lng: coords.lng
        }
      };
      this.emergencyModel.location = {
        lat: coords.lat,
        lng: coords.lng
      };
    },
    mapClick(click) {
      this.addMarker({
        lat: click.latLng.lat(),
        lng: click.latLng.lng()
      });
      this.searchLocationReverse();
    },
    searchLocationReverse: function() {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: this.emergencyModel.location },
        (results, status) => {
          if (status === "OK") {
            this.emergencyModel.address = results[0].formatted_address;
            document.getElementById("address").value =
              results[0].formatted_address;
          }
        }
      );
    }
  }
};
</script>