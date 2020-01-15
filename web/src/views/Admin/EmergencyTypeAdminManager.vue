<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
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
      <div class="row" v-if="actorTypes.length == 0">
        <div class="col">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="mb-0 text-center">ESCOGE UN GRUPO DE ACTORES</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <v-select
                    v-model="actorTypeSelected"
                    :options="actorTypes"
                    label="name"
                    @input="loadEmegencyTypes"
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
      <br>
      <div class="row" v-if="actorTypeSelected">
        <!--Tables-->
        <div class="col">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="mb-0">Tipos de Emergencia: {{actorTypeSelected.name.toUpperCase()}}</h2>
                </div>
                <div>
                  <base-button
                    type="success"
                    icon="ni ni-ambulance"
                    @click="showAddEmergencyType()"
                  >Agregar Tipo de Emergencia</base-button>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="emergencyTypes"
                :error="error"
              >
                <template slot="columns">
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Actor</th>
                </template>

                <template slot-scope="{row}">
                  <td>{{row.name.toUpperCase()}}</td>
                  <td>{{row.description ? row.description.toUpperCase() : '-'}}</td>
                  <td>{{row.actorType_id ? row.actorType_id.name.toUpperCase() : '-'}}</td>
                </template>
              </base-table>
            </div>
          </div>
        </div>
      </div>
      <!--End tables-->
    </div>

    <!-- MODAL: ADD EMERGENCY TYPE -->
    <div class="col-md-4">
      <modal
        :closeInBackground="false"
        :show.sync="addEmergencyTypeModal"
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
              <h2>Agregar Tipo de Emergencia</h2>
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
                    <base-input required v-model="emergencyType.name"></base-input>
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
                      v-model="emergencyType.description"
                    ></textarea>
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
                  @click="addEmergencyType()"
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
      addEmergencyTypeModal: false,
      confirmCancelModal: false,
      emergencyTypes: [],
      error: null,
      emergencyType: {
        actorType_id: null,
        name: null,
        description: null
      },
      actorGroupTypeSelected: null,
      actorTypeSelected: null,
      actorsGroupTypes: [],
      actorTypes: []
    };
  },
  created() {
    this.loadActorsGroupType();
  },
  mounted() {
    if (this.totalEmergenciasHoy != 0) {
      this.claseIconoEmergenciasHoy = "fa fa-arrow-up";
    }
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
      this.actorTypes = [];
      this.actorTypeSelected = null;
      if (!actorGroupTypeSelected) return;

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
    loadEmegencyTypes() {
      if(!this.actorTypeSelected) return;
      utilsService
        .getEmergencyTypesByActorType(this.actorTypeSelected._id)
        .then(res => {
          this.emergencyTypes = res.response;
          this.isLoading = false;
        })
        .catch(res => {
          this.emergencyTypes = [];
          this.isLoading = false;
        });
    },
    showAddEmergencyType() {
      this.addEmergencyTypeModal = true;
    },
    confirmCancel() {
      this.confirmCancelModal = false;
      this.addEmergencyTypeModal = false;
    },
    addEmergencyType() {
      this.emergencyType.actorType_id = this.actorTypeSelected._id;
      this.isLoading = true;
      utilsService
        .addEmergencyType(this.emergencyType)
        .then(res => {
          this.loadEmegencyTypes();
          this.addEmergencyTypeModal = false;
          this.isLoading = false;
        })
        .catch(err => {
          this.loadEmegencyTypes();
          this.isLoading = false;
        });
    }
  }
};
</script>