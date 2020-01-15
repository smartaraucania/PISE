<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="row justify-content-center">
        <div class="col-xl-4 col-lg-6">
          <base-button
            block
            type="warning"
            @click="loadEventTypes(false)"
          >VER TIPOS DE EVENTOS GLOBALES</base-button>
        </div>
      </div>
      <br />
      <div class="row justify-content-center">
        <div
          class="col-xl-4 col-lg-6"
          v-for="actorsGroupType in actorsGroupTypes"
          :key="actorsGroupType._id"
        >
          <base-button
            block
            type="warning"
            @click="loadActorsType(actorsGroupType)"
          >{{ (actorsGroupType.groupName).toUpperCase() }}</base-button>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col" v-if="!publicTE">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <v-select
                    v-model="actorTypeSelected"
                    :options="actorTypes"
                    label="name"
                    @input="loadEventTypes(true)"
                    :required="!actorTypeSelected"
                    :placeholder="'Seleciona un Tipo de Actor'"
                  >
                    <template slot="option" slot-scope="option">{{ option.name.toUpperCase() }}</template>
                    <template
                      slot="selected-option"
                      slot-scope="option"
                    >{{ option.name.toUpperCase() }}</template>
                    <span slot="no-options">No encontrado.</span>
                  </v-select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div class="row">
        <!--Tables-->
        <div class="col" v-if="eventTypes != 0">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="mb-0">Tipos de Eventos: {{actorTypeSelected ? actorTypeSelected.name.toUpperCase() : 'GENERALES'}}</h2>
                </div>
                <div>
                  <base-button
                    type="success"
                    icon="ni ni-ambulance"
                    @click="showAddEventType()"
                  >Agregar Tipo de Evento</base-button>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="eventTypes"
                :error="error"
              >
                <template slot="columns">
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Actor</th>
                </template>

                <template slot-scope="{row}">
                  <td>{{row.name.toUpperCase()}}</td>
                  <td>{{row.description ? row.description : '-'}}</td>
                  <td>{{row.actorType_id ? row.actorType_id.name.toUpperCase() : '-'}}</td>
                </template>
              </base-table>
            </div>
          </div>
        </div>
      </div>
      <div v-if="eventTypes.length == 0">
        <div class="row" v-if="search | publicTE">
          <div class="col">
            <br />
            <div class="text-center">
              <base-button
                type="success"
                icon="ni ni-ambulance"
                @click="showAddEventType()"
              >Agregar Tipo de Evento</base-button>
            </div>
            <br />
            <h2
              class="mb-0 text-center"
            >NO EXISTEN TIPOS DE EVENTO {{ actorTypeSelected ? 'DE '+actorTypeSelected.name.toUpperCase() : 'GENERALES'}}</h2>
          </div>
        </div>
      </div>
      <!--End tables-->
    </div>

    <!-- MODAL: ADD EVENT TYPE -->
    <div class="col-md-4">
      <modal
        :closeInBackground="false"
        :show.sync="addEventTypeModal"
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
              <h2>Agregar Tipo de Evento</h2>
              <h3
                class="text-danger"
              >{{ actorTypeSelected ? 'Agregando a '+actorTypeSelected.name.toUpperCase() : 'Agregando de manera General o Pública'}}</h3>
            </div>
          </template>
          <template>
            <form role="form">
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4>Nombre*</h4>
                    </label>
                    <base-input required v-model="eventType.name"></base-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4>Descripción</h4>
                    </label>
                    <textarea
                      class="form-control"
                      rows="2"
                      placeholder="Descripción"
                      v-model="eventType.description"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <base-checkbox class="mb-3" v-model="eventType.selectable">Seleccionable</base-checkbox>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <span class="text-muted">* Campos requeridos</span>
                </div>
              </div>
              <div class="text-center">
                <base-button type="plain" class="my-4" @click="confirmCancelModal = true">Cancelar</base-button>
                <base-button
                  type="success"
                  class="my-4"
                  @click="addEventType()"
                >Agregar Tipo de Emergencia</base-button>
              </div>
            </form>
          </template>
        </card>
      </modal>

      <div class="col-md-4">
        <modal
          :show.sync="confirmCancelModal"
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
            <base-button type="white" @click="confirmCancel()">Si, cancelar</base-button>
            <base-button
              type="link"
              text-color="white"
              class="ml-auto"
              @click="confirmCancelModal = false"
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
}
.modal {
  z-index: 20;
}
</style>
<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import "vue-select/dist/vue-select.css";

import { utilsService } from "../../services";

export default {
  components: {
    Loading
  },
  data() {
    return {
      isLoading: false,
      addEventTypeModal: false,
      confirmCancelModal: false,
      eventTypes: [],
      error: null,
      eventType: {
        actorType_id: null,
        name: null,
        description: null,
        isPublic: true,
        selectable: false
      },
      actorGroupTypeSelected: null,
      actorTypeSelected: null,
      actorsGroupTypes: [],
      actorTypes: [],
      publicTE: true,
      search: false
    };
  },
  created() {
    this.loadActorsGroupType();
    this.loadEventTypes();
  },
  methods: {
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
    loadActorsType(actorGroupTypeSelected) {
      this.search = false;
      this.publicTE = false;
      this.actorTypes = [];
      this.eventTypes = [];
      this.actorTypeSelected = null;
      if (!actorGroupTypeSelected) return;

      this.actorGroupTypeSelected = actorGroupTypeSelected;
      this.isLoading = true;
      utilsService
        .getActorTypesByActorsGroup(actorGroupTypeSelected._id)
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
    loadEventTypes(isActorType) {
      this.search = true;
      if (!isActorType) {
        this.actorTypeSelected = null;
        this.actorGroupTypeSelected = null;
        this.actorTypes = [];
        this.publicTE = true;
      }
      if (!this.actorTypeSelected) {
        utilsService
          .getEventTypesPublic()
          .then(res => {
            this.eventTypes = res.response;
            this.isLoading = false;
          })
          .catch(res => {
            this.eventTypes = [];
            this.isLoading = false;
          });
      } else {
        utilsService
          .getEventTypeByActorsType(this.actorTypeSelected._id)
          .then(res => {
            this.eventTypes = res.response;
            this.isLoading = false;
          })
          .catch(res => {
            this.eventTypes = [];
            this.isLoading = false;
          });
      }
    },
    showAddEventType() {
      this.clean();
      this.addEventTypeModal = true;
    },
    confirmCancel() {
      this.confirmCancelModal = false;
      this.addEventTypeModal = false;
    },
    addEventType() {
      this.isLoading = true;
      if (!this.publicTE && this.actorTypeSelected) {
        this.eventType.actorType_id = this.actorTypeSelected._id;
        utilsService
          .addEventTypeToActorType(this.eventType)
          .then(res => {
            this.loadEventTypes();
            this.addEventTypeModal = false;
            this.isLoading = false;
          })
          .catch(err => {
            this.loadEventTypes();
            this.isLoading = false;
          });
      } else {
        this.eventType.isPublic = true;
        utilsService
          .addPublicEventType(this.eventType)
          .then(res => {
            this.loadEventTypes();
            this.addEventTypeModal = false;
            this.isLoading = false;
          })
          .catch(err => {
            this.loadEventTypes();
            this.isLoading = false;
          });
      }
    },
    clean(){
      this.eventType.actorType_id = null;
      this.eventType.name = null;
      this.eventType.description = null;
      this.eventType.selectable = false;
    }
  }
};
</script>