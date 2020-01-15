<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="text-center mb-2">
        <base-button
          v-if="
            emergencyObject &&
              !emergencyObject.finalized &&
              (!emergencyObject.othersActorsTypesConfirm_id ||
                emergencyObject.othersActorsTypesConfirm_id.indexOf(
                  $loggedUser.actorType
                ) == -1)
          "
          type="success"
          outline
          block
          icon="ni ni-user-run"
          @click="showRoadTo()"
          ><strong>CAMINO AL LUGAR</strong></base-button
        >
      </div>
      <div class="text-center mb-2">
        <base-button
          v-if="emergencyObject && !emergencyObject.finalized"
          type="info"
          outline
          block
          icon="fa fa-phone"
          @click="showNeedHelp()"
          ><strong>SOLICITAR AYUDA A OTRO ACTOR</strong></base-button
        >
      </div>
      <div class="text-center mb-2">
        <base-button
          v-if="emergencyObject && !emergencyObject.finalized"
          type="danger"
          outline
          block
          icon="fa fa-stop"
          @click="showFinalize()"
          ><strong>FINALIZAR EMERGENCIA</strong></base-button
        >
      </div>
    </base-header>
    <div class="row" v-if="emergencyObject">
      <div class="container-fluid mt--7">
        <div class="row">
          <div class="col">
            <div class="card shadow">
              <div class="card-header border-0">
                <div class="row align-items-center">
                  <div class="col">
                    <h2 class="mb-2">
                      <strong
                        >{{
                          $moment(emergencyObject.date).format(
                            "DD-MMMM-YY | H:mm"
                          )
                        }}
                      </strong>
                    </h2>
                    <h2 class="mb-1">
                      <strong>{{
                        emergencyObject.emergencyType_id.name
                      }}</strong>
                      <span class="text-muted ml-2"
                        >({{
                          emergencyObject.emergencyType_id.description
                        }})</span
                      >
                    </h2>
                    <h4 class="mb-0">{{ emergencyObject.details }}</h4>
                    <br />
                    <h2 class="mb-0">
                      ÚLTIMA ACTUALIZACIÓN:
                      <span class="text-danger">{{
                        emergencyObject.lastEvent
                          ? emergencyObject.lastEvent.eventType_id.name.toUpperCase() +
                            " por " +
                            emergencyObject.lastEvent.user
                          : "CREADA"
                      }}</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div class="row">
              <div class="col">
                <div class="card shadow border-0">
                  <div class="card-header border-0">
                    <div class="row align-items-center">
                      <div class="col">
                        <h2 class="mb-0">
                          Dirección ({{ emergencyObject.address }})
                        </h2>
                      </div>
                    </div>
                  </div>
                  <gmap-map
                    :center="emergencyObject.location"
                    :zoom="zoom"
                    :options="{ scrollwheel: true }"
                    style="width:100%;  height: 400px;"
                  >
                    <gmap-marker :position="marker.position"></gmap-marker>
                  </gmap-map>
                  <span v-if="emergencyObject.location.date">
                    Última actualización el {{ 
                      $moment(emergencyObject.locacion.date).format(
                            "DD-MMMM-YY | H:mm")
                            }}</span>
                </div>
              </div>
              <div class="col">
                <div class="card shadow">
                  <div class="card-header border-0">
                    <div class="row align-items-center">
                      <div class="col">
                        <h2 class="mb-0">Eventos de la Emergencia</h2>
                      </div>
                    </div>
                  </div>

                  <div class="table-responsive">
                    <base-table
                      class="table align-items-center table-flush"
                      thead-classes="thead-light"
                      tbody-classes="list clickeable"
                      type="hover"
                      :data="emergencyObject.events"
                      :error="error"
                    >
                      <template slot="columns">
                        <th>Fecha</th>
                        <th>Tipo de Evento</th>
                        <th>Nombre Usuario</th>
                        <th>Por Actor</th>
                        <th>Hacia Actor</th>
                        <th>Descripción</th>
                      </template>

                      <template slot-scope="{ row }">
                        <td @click="showDetails(row)">
                          {{ $moment(row.date).format("DD-MMMM-YY H:mm") }}
                        </td>
                        <td @click="showDetails(row)">
                          {{ row.eventType_id.name.toUpperCase() }}
                        </td>
                        <td @click="showDetails(row)">
                          {{ row.user.toUpperCase() }}
                        </td>
                        <td @click="showDetails(row)">
                          {{ row.by_actorType_id.name.toUpperCase() }}
                        </td>
                        <td @click="showDetails(row)">
                          {{
                            row.to_actorType_id
                              ? row.to_actorType_id.name.toUpperCase()
                              : "-"
                          }}
                        </td>
                        <td @click="showDetails(row)">
                          {{
                            row.description
                              ? row.description.length
                                ? "Ver"
                                : ""
                              : ""
                          }}
                        </td>
                      </template>
                    </base-table>
                    <div>
                      <base-pagination
                        class="mr-4"
                        @input="loadEmergency(emergencyObject._id, eventsCurrentPage)"
                        v-model="eventsCurrentPage"
                        :pageCount="emergencyObject.eventsPages"
                        :perPage="emergencyObject.eventsLimit"
                        :total="emergencyObject.eventsTotal"
                        align="end"
                      ></base-pagination>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div class="row">
              <div class="col">
                <div class="card shadow border-0">
                  <div class="card-header border-0">
                    <div class="row align-items-center">
                      <div class="col">
                        <h2 class="mb-0">Reporte inicial</h2>
                      </div>
                    </div>
                  </div>
                  <div
                    class="row"
                    v-if="
                      !emergencyObject.initialReport.lastAppUser_id &&
                        !emergencyObject.initialReport.lastWebUser_id
                    "
                  >
                    <div class="col text-center">
                      <h2 class="mb-4 text-danger">Sin Reporte Inicial</h2>
                    </div>
                  </div>
                  <div v-else>
                    <div class="row">
                      <div class="col">
                        <div class="ml-2 mb-2">
                          <h3>
                            <strong>Último Usuario en Actualizar</strong>
                          </h3>
                          <h4 class="ml-2">
                            {{
                              emergencyObject.initialReport.lastAppUser_id
                                ? emergencyObject.initialReport.lastAppUser_id.name.toUpperCase()
                                : emergencyObject.initialReport.lastWebUser_id.name.toUpperCase()
                            }}
                          </h4>
                        </div>
                      </div>
                      <div class="col">
                        <div class="ml-2 mb-2 mr-2">
                          <h3>
                            <strong>Detalles</strong>
                          </h3>
                          {{ emergencyObject.initialReport.text }}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col mb-2 ml-2 mr-2">
                        <div
                          v-if="
                            emergencyObject.initialReport.photosURL.length > 0
                          "
                        >
                          <h3>
                            <strong>Fotos</strong>
                          </h3>
                          <div
                            class="image ml-2"
                            v-for="(image, imageIndex) in emergencyObject
                              .initialReport.photosURL"
                            :key="imageIndex"
                            @click="index = imageIndex"
                            :style="{
                              backgroundImage: 'url(' + image + ')',
                              width: '300px',
                              height: '200px'
                            }"
                          ></div>
                        </div>
                        <h3 v-else>
                          <strong>Sin Fotos</strong>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4" v-if="emergencyObject">
      <!-- Road To Modal -->
      <div class="col-md-4">
        <modal
          :show.sync="roadToModal"
          modal-classes="modal-success modal-dialog-centered"
        >
          <h6 slot="header" class="modal-title" id="modal-title-notification">
            Confirma la siguiente acción
          </h6>

          <div class="py-3 text-center">
            <i class="fa fa-exclamation-triangle ni-3x"></i>
            <h4 class="heading mt-4">
              ¿Desea confirmar que su servicio irá en camino?
            </h4>
            <p>Esta acción notificará al servicio que lo solicitó</p>
          </div>

          <template slot="footer">
            <base-button type="white" @click="action_roadTo()"
              >Si, confirmar</base-button
            >
            <base-button
              type="link"
              text-color="white"
              class="ml-auto"
              @click="roadToModal = false"
              >No</base-button
            >
          </template>
        </modal>
      </div>
      <!-- -->
      <!-- Need Help Modal -->
      <!-- Add event modal -->
      <div class="col-md-4">
        <modal
          :closeInBackground="false"
          :show.sync="needHelpModal"
          body-classes="p-0"
          modal-classes="modal-dialog-centered modal-xl"
        >
          <card
            gradient="secondary"
            shadow
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0"
          >
            <template>
              <div class="text-center mb-3">
                <h2>Solicitar Actor en emergencia</h2>
              </div>
            </template>
            <template>
              <form role="form">
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label>
                        <h4>Seleccion el Tipo de Actor</h4>
                      </label>
                      <br />
                      <v-select
                        class="style-chooser"
                        v-model="actorGroupTypeSelected"
                        @input="loadActorsType"
                        :options="actorsGroupTypes"
                        label="groupName"
                        :placeholder="'Seleciona un Grupo de Tipo de Actores'"
                      >
                        <template slot="option" slot-scope="option">{{
                          option.groupName.toUpperCase()
                        }}</template>
                        <template slot="selected-option" slot-scope="option">{{
                          option.groupName.toUpperCase()
                        }}</template>
                        <span slot="no-options">No encontrado.</span>
                      </v-select>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-group">
                      <label>
                        <h4>&nbsp;</h4>
                      </label>
                      <br />
                      <v-select
                        v-model="actorTypeSelected"
                        :options="actorTypes"
                        label="name"
                        :placeholder="'Seleciona un tipo de actor'"
                      >
                        <template slot="option" slot-scope="option">{{
                          option.name.toUpperCase()
                        }}</template>
                        <template slot="selected-option" slot-scope="option">{{
                          option.name.toUpperCase()
                        }}</template>
                        <span slot="no-options">No encontrado.</span>
                      </v-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="details">
                        <h4>Detalles</h4>
                      </label>
                      <textarea
                        class="form-control"
                        rows="3"
                        placeholder="Agregar detalles (opcional)"
                        v-model="askforhelp.description"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <base-button
                    type="plain"
                    class="my-4"
                    @click="needHelpModal = false"
                    >Cancelar</base-button
                  >
                  <base-button
                    type="info"
                    class="my-4"
                    @click="showConfirmHelp()"
                    >Pedir su ayuda</base-button
                  >
                </div>
              </form>
            </template>
          </card>
        </modal>
      </div>
      <!-- -->
      <!-- Need Help Confirm Modal -->
      <div class="col-md-4">
        <modal
          :show.sync="needHelpConfirmModal"
          gradient="info"
          modal-classes="modal-info modal-dialog-centered"
        >
          <h6 slot="header" class="modal-title" id="modal-title-notification">
            Confirma la siguiente acción
          </h6>

          <div class="py-3 text-center">
            <i class="fa fa-exclamation-triangle ni-3x"></i>
            <h4 class="heading mt-4">
              ¿Desea confirmar la siguiente solicitud?
            </h4>
            <p>
              Necesidad del actor:
              {{
                actorTypeSelected ? actorTypeSelected.name.toUpperCase() : ""
              }}
            </p>
            <p style="font-size: small">Esto notificará al actor</p>
          </div>

          <template slot="footer">
            <base-button type="white" @click="action_needHelp()"
              >Si, confirmar</base-button
            >
            <base-button
              type="link"
              text-color="white"
              class="ml-auto"
              @click="needHelpConfirmModal = false"
              >No</base-button
            >
          </template>
        </modal>
      </div>
      <!-- -->
      <!-- Finalize Modal -->
      <div class="col-md-4">
        <modal
          :show.sync="finalizeModal"
          modal-classes="modal-danger modal-dialog-centered"
        >
          <h6 slot="header" class="modal-title" id="modal-title-notification">
            Confirma la siguiente acción
          </h6>

          <div class="py-3 text-center">
            <i class="fa fa-exclamation-triangle ni-3x"></i>
            <h4 class="heading mt-4">Cuidado!</h4>
            <p>¿Desea confirmar que la emergencia ya finalizó?</p>
          </div>

          <template slot="footer">
            <base-button type="white" @click="action_finalize()"
              >Si, confirmar</base-button
            >
            <base-button
              type="link"
              text-color="white"
              class="ml-auto"
              @click="finalizeModal = false"
              >No</base-button
            >
          </template>
        </modal>
      </div>
      <!-- -->
      <!-- View Description Modal -->
      <div class="col-md-4" v-if="eventSelected">
        <modal
          :show.sync="descriptionModal"
          modal-classes="modal-primary modal-dialog-centered"
        >
          <h6 slot="header" class="modal-title" id="modal-title-notification">
            Descripción del evento
          </h6>

          <div class="py-3 text-center">
            <i class="fa fa-info-circle ni-3x"></i>
            <h3 class="heading mt-4">
              {{ eventSelected.description }}
            </h3>
            <br />
            <p class="mb-0">
              <span style="font-weight: bold">Fecha:</span>
              {{ $moment(eventSelected.date).format("DD-MMMM-YY H:mm") }}
            </p>
            <p class="mb-0">
              <span style="font-weight: bold">Tipo evento:</span>
              {{ eventSelected.eventType_id.name.toUpperCase() }}
            </p>
            <p class="mb-0">
              <span style="font-weight: bold">Por:</span>
              {{ eventSelected.user.toUpperCase() }} ({{
                eventSelected.by_actorType_id.name.toUpperCase()
              }})
            </p>
            <p class="mb-0" v-if="eventSelected.to_actorType_id">
              <span style="font-weight: bold">Hacia:</span>
              {{ eventSelected.to_actorType_id.name.toUpperCase() }}
            </p>
          </div>

          <template slot="footer">
            <base-button type="white" @click="descriptionModal = false"
              >Ok</base-button
            >
          </template>
        </modal>
      </div>
      <!-- -->
    </div>
    <gallery
      v-if="emergencyObject"
      :images="emergencyObject.initialReport.photosURL"
      :index="index"
      @close="index = null"
    ></gallery>
    <div class="vld-parent">
      <loading
        :active.sync="isLoading"
        :can-cancel="true"
        :is-full-page="true"
      ></loading>
    </div>
  </div>
</template>
<style scoped>
.image {
  float: left;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 1px solid #ebebeb;
  margin: 5px;
}
.modal {
  z-index: 20;
}
</style>
<script>
import { emergencyService, utilsService } from "../../services";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import VueGallery from "vue-gallery";
import "vue-select/dist/vue-select.css";

export default {
  components: {
    Loading,
    gallery: VueGallery
  },
  props: {
    emergency: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      geolocation: { lat: -38.73965, lng: -72.59842 },
      zoom: 17,
      marker: {},
      address: null,
      emergencyObject: null,
      emergencyId: null,
      isLoading: true,
      error: null,
      index: null,
      actorsGroupTypes: [],
      actorGroupTypeSelected: null,
      actorTypes: [],
      actorTypeSelected: null,
      roadToModal: false,
      needHelpModal: false,
      needHelpConfirmModal: false,
      finalizeModal: false,
      askforhelp: {
        actorType_id: null,
        description: null
      },
      showRoadToButton: true,
      descriptionModal: false,
      eventSelected: null,
      eventsCurrentPage: 1,
    };
  },
  async created() {
    if (!this.emergency) {
      this.emergencyId = localStorage.getItem("emergency_id");
      this.loadEmergency(this.emergencyId, 1);
    } else {
      this.loadEmergency(this.emergencyId, 1);
    }
    this.loadActorsGroupType();
  },
  mounted() {
    this.$socket.on("notifyroadto", async data => {
      if (
        data.to._id == this.$loggedUser.actorType &&
        data.from != this.$loggedUser.name + " " + this.$loggedUser.lastName
      ) {
        this.loadEmergency(this.emergencyObject._id);
      }
    });
  },
  methods: {
    loadEmergency(id, eventsPage) {
      emergencyService
        .getById(id, eventsPage)
        .then(res => {
          this.emergencyObject = res.response;
          this.marker = {
            position: this.emergencyObject.location
          };
          this.isLoading = false;
          var emergenciesIdViewed = this.$store.getters.getEmergenciesIdViewed;
          emergenciesIdViewed.push(this.emergencyObject._id);
          localStorage.setItem(
            "emergenciesIdViewed",
            JSON.stringify(emergenciesIdViewed)
          );
        })
        .catch(err => {
          this.notify(
            "Ocurrio un error al obtener la emergencia",
            null,
            "danger"
          );
          this.isLoading = false;
          this.$router.back();
        });
    },
    loadActorsGroupType() {
      this.isLoading = true;
      utilsService
        .getActorsGroups()
        .then(res => {
          this.actorsGroupTypes = res.response;
          this.isLoading = false;
        })
        .catch(res => {
          this.actorsGroupTypes = [];
          this.isLoading = false;
        });
    },
    loadActorsType() {
      this.actorTypes = [];
      this.actorTypeSelected = null;
      if (!this.actorGroupTypeSelected) return;

      this.isLoading = true;
      utilsService
        .getActorTypesByActorsGroup(this.actorGroupTypeSelected._id)
        .then(res => {
          this.actorTypes = res.response;
          this.isLoading = false;
        })
        .catch(err => {
          this.actorTypes = null;
          this.isLoading = false;
          this.errorAT = true;
        });
    },
    loadEventTypes(actorType) {
      this.isLoading = true;
      utilsService
        .getEventTypeByActorsType(actorType, true)
        .then(res => {
          this.eventTypes = res.response;
          this.isLoading = false;
        })
        .catch(res => {
          this.eventTypes = [];
          this.isLoading = false;
        });
    },
    showRoadTo() {
      this.roadToModal = true;
    },
    action_roadTo() {
      this.isLoading = true;
      emergencyService
        .notifyRoadToEmergency(this.emergencyObject._id)
        .then(res => {
          this.roadToModal = false;
          this.notify(
            "Ha confirmado su asistena a la emergencia",
            null,
            "success"
          );
          this.loadEmergency(res._id);
        })
        .catch(err => {
          this.isLoading = false;
          this.notify(err[0].error, null, "danger");
        });
    },
    showNeedHelp() {
      this.actorGroupTypeSelected = null;
      this.actorTypeSelected = null;
      this.needHelpModal = true;
    },
    showConfirmHelp() {
      if (this.actorTypeSelected) {
        this.needHelpConfirmModal = true;
        this.askforhelp.actorType_id = this.actorTypeSelected._id;
      } else {
        this.notify("Debe escoger un tipo de actor!", null, "warning");
      }
    },
    action_needHelp() {
      this.isLoading = true;
      emergencyService
        .askForHelpToOtherService(this.emergencyObject._id, this.askforhelp)
        .then(res => {
          this.needHelpConfirmModal = false;
          this.needHelpModal = false;
          this.notify("Ha solicitado la ayuda", null, "success");
          this.loadEmergency(res._id);
        })
        .catch(err => {
          this.isLoading = false;
          this.needHelpConfirmModal = false;
          this.notify(err[0].error, null, "danger");
        });
    },
    showFinalize() {
      this.finalizeModal = true;
    },
    action_finalize() {
      this.isLoading = true;
      emergencyService
        .setEmergencyFinalized(this.emergencyObject._id)
        .then(res => {
          this.finalizeModal = false;
          this.notify("Emergencia finalizada", null, "success");
          this.loadEmergency(res._id);
        })
        .catch(err => {
          this.isLoading = false;
          this.notify(err[0].error, null, "danger");
        });
    },
    showDetails(event) {
      if (event.description) {
        this.eventSelected = event;
        this.descriptionModal = true;
      }
    }
  }
};
</script>
