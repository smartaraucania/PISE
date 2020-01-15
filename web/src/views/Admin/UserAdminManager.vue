<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8"></base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <!--Tables-->
        <div class="col">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="mb-0">Usuarios WEB</h2>
                </div>
                <div>
                  <base-button
                    type="danger"
                    icon="ni ni-ambulance"
                    @click="showAddWebUser()"
                  >Agregar Usuario Web</base-button>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <base-table
                class="table align-items-center table-hover"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="webUsers"
                :error="errorWU"
              >
                <template slot="columns">
                  <th>Estado</th>
                  <th>Nombre</th>
                  <th>Tipo de Actor</th>
                  <th>Oficina</th>
                  <th>Email</th>
                  <th>Otros</th>
                  <th>Último Login</th>
                </template>

                <template slot-scope="{row}">
                  <td style="width: 1%">
                    <badge class="badge-dot ml-3">
                      <i :class="`bg-${row.enabled ? 'success' : 'danger'}`"></i>
                    </badge>
                  </td>
                  <td>{{row.name}} {{row.lastName}}</td>
                  <td>{{row.actorType_id ? row.actorType_id.name.toUpperCase() : '-'}}</td>
                  <td>{{row.office_id ? row.office_id.name.toUpperCase() : '-'}}</td>
                  <td>{{row.email}}</td>
                  <td>
                    <span style="color: black; font-weight: bold">{{row.isAdmin ? 'A' : ''}}</span>
                    <span style="color: red; font-weight: bold">{{row.isSuperUser ? ' SU' : ''}}</span>
                    <span
                      style="color: green; font-weight: bold"
                    >{{ row.isGovernment ? ' GOB' : ''}}</span>
                  </td>
                  <td>{{row.loginHistory[row.loginHistory.length-1] ? $moment(row.loginHistory[row.loginHistory.length-1].date).format('HH:mm [el] DD/MM/YYYY')+' en '+row.loginHistory[row.loginHistory.length-1].location : '-'}}</td>
                </template>
              </base-table>
            </div>
          </div>
        </div>
      </div>
      <!--End tables-->
    </div>

    <!-- MODAL: ADD USER -->
    <div class="col-md-4">
      <modal
        id="addUserModal"
        ref="addUserModal"
        :closeInBackground="false"
        :show.sync="addUserModal"
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
              <h2>Agregar Usuario WEB</h2>
            </div>
          </template>
          <div class="text-center text-muted mb-4" v-if="modalErrors">
            <h4
              class="text-danger"
              v-for="error in modalErrors"
              v-bind:key="error.error"
            >{{ error.error }}</h4>
          </div>
          <template>
            <form role="form">
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4 :style="{color: userModelValid.name == null  ? '' : 'red'}">Nombre*</h4>
                    </label>
                    <base-input v-model="userModel.name" :valid="userModelValid.name"></base-input>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4 :style="{color: userModelValid.lastName == null  ? '' : 'red'}">Apellido*</h4>
                    </label>
                    <base-input v-model="userModel.lastName" :valid="userModelValid.lastName"></base-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4 :style="{color: userModelValid.email == null  ? '' : 'red'}">Email*</h4>
                    </label>
                    <base-input v-model="userModel.email" :valid="userModelValid.email"></base-input>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4>Télefono</h4>
                    </label>
                    <base-input v-model="userModel.phone"></base-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4
                        :style="{color: userModelValid.actorType_id == null  ? '' : 'red'}"
                      >Tipo de Actor*</h4>
                    </label>
                    <br />
                    <label>
                      <h4 :style="{color: userModelValid.actorType_id == null  ? '' : 'red'}">Grupo de Actores</h4>
                    </label>
                    <v-select
                      v-model="actorGroupTypeSelected"
                      @input="loadActorsType"
                      :options="actorsGroupTypes"
                      label="groupName"
                      :placeholder="'Seleciona un Grupo de Tipo de Actores'"
                    >
                      <template
                        slot="option"
                        slot-scope="option"
                      >{{ option.groupName.toUpperCase() }}</template>
                      <template
                        slot="selected-option"
                        slot-scope="option"
                      >{{ option.groupName.toUpperCase() }}</template>
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
                    <label>
                      <h4 :style="{color: userModelValid.actorType_id == null  ? '' : 'red'}">Tipo de Actor</h4>
                    </label>
                    <v-select
                      v-model="actorTypeSelected"
                      @input="loadOffices"
                      :options="actorTypes"
                      label="name"
                      :placeholder="'Seleciona un tipo de actor'"
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
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4>Oficina</h4>
                    </label>
                    <br />
                    <label>
                      <h4>País Oficina*</h4>
                    </label>
                    <v-select
                      v-model="selectedCountry"
                      :options="countries"
                      label="name"
                      @input="loadRegions"
                      :required="!selectedCountry"
                      :placeholder="'Seleciona un País'"
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
                <div class="col" v-if="selectedCountry">
                  <div class="form-group">
                    <label>
                      <h4>&nbsp;</h4>
                    </label>
                    <br />
                    <label>
                      <h4>Región Oficina*</h4>
                    </label>
                    <v-select
                      v-model="selectedRegion"
                      :options="regions"
                      label="name"
                      @input="loadCommunes"
                      :required="!selectedRegion"
                      :placeholder="'Seleciona una Región'"
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
                <div class="col" v-if="selectedRegion">
                  <div class="form-group">
                    <label>
                      <h4>&nbsp;</h4>
                    </label>
                    <br />
                    <label>
                      <h4>Comuna Oficina</h4>
                    </label>
                    <v-select
                      v-model="selectedCommune"
                      :options="communes"
                      @input="loadOffices"
                      label="name"
                      :required="!selectedCommune"
                      :placeholder="'Seleciona una Comuna'"
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
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <v-select
                      v-model="selectedOffice"
                      :options="offices"
                      label="name"
                      :required="!selectedOffice"
                      :placeholder="'Seleciona una Oficina'"
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
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4>Otros</h4>
                    </label>
                    <base-checkbox class="mb-3" v-model="userModel.isSuperUser">Super Usuario</base-checkbox>
                    <base-checkbox class="mb-3" v-model="userModel.isGovernment">Usuario Gobierno</base-checkbox>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4>Detalle Adicional</h4>
                    </label>
                    <textarea class="form-control" rows="3" v-model="userModel.additionalDetails"></textarea>
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
                <base-button type="danger" class="my-4" @click="checkAddUser()">Agregar Usuario WEB</base-button>
              </div>
            </form>
          </template>
        </card>
      </modal>
    </div>

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

import { userService, utilsService } from "../../services";

export default {
  components: {
    Loading
  },
  data() {
    return {
      isLoading: false,
      addUserModal: false,
      confirmCancelModal: false,
      webUsers: [],
      errorWU: null,
      userModel: {
        name: null,
        lastName: null,
        email: null,
        phone: null,
        actorType_id: null,
        isSuperUser: false,
        isGovernment: false,
        additionalDetails: null,
        office_id: null
      },
      userModelValid: {
        name: null,
        lastName: null,
        email: null,
        actorType_id: null
      },
      actorGroupTypeSelected: null,
      actorTypeSelected: null,
      actorsGroupTypes: [],
      actorTypes: [],
      countries: [],
      regions: [],
      communes: [],
      selectedCountry: null,
      selectedRegion: null,
      selectedCommune: null,
      selectedOffice: null,
      offices: [],
      modalErrors: []
    };
  },
  created() {
    this.loadCountries();
    this.loadActorsGroupType();
    this.loadWebUsers();
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
    loadWebUsers() {
      this.isLoading = true;
      userService
        .getWebUsersByAdmin()
        .then(res => {
          this.webUsers = res.response;
          this.isLoading = false;
        })
        .catch(res => {
          this.webUsers = [];
          this.isLoading = false;
          this.errorWU = true;
        });
    },
    showAddWebUser() {
      this.addUserModal = true;
      this.cleanUserModel();
    },
    confirmCancel() {
      this.confirmCancelModal = false;
      this.addUserModal = false;
      this.cleanUserModel();
    },
    checkAddUser() {
      this.cleanUserModelValid();
      this.modalErrors = [];
      if (!this.actorTypeSelected) {
        this.modalErrors.push({ error: "Falta elegir el tipo de actor" });
        this.userModelValid.actorType_id = false;
      }
      if (!this.userModel.name) {
        this.modalErrors.push({ error: "Falta el nombre" });
        this.userModelValid.name = false;
      }
      if (!this.userModel.lastName) {
        this.modalErrors.push({ error: "Falta el apellido" });
        this.userModelValid.lastName = false;
      }
      if (!this.userModel.email) {
        this.modalErrors.push({ error: "Falta el email" });
        this.userModelValid.email = false;
      }
      if (this.modalErrors.length > 0) {
        document.getElementById("addUserModal").scrollTo(0, 0);
        return;
      }
      return this.addUser();
    },
    addUser() {
      this.userModel.actorType_id = this.actorTypeSelected._id;
      if (this.selectedOffice)
        this.userModel.office_id = this.selectedOffice._id;
      this.isLoading = true;
      userService
        .addWebUser(this.userModel)
        .then(res => {
          this.loadWebUsers();
          this.addUserModal = false;
          this.isLoading = false;
          this.cleanUserModel();
          this.notify(
            "Usuario agregado correctamente",
            "fa fa-thumbs-up",
            "success"
          );
        })
        .catch(err => {
          this.notify(
            "Ocurrio un error al agregar el usuario",
            "fa fa-exclamation",
            "danger"
          );
          this.modalErrors = err;
          this.isLoading = false;
        });
    },
    cleanUserModel() {
      this.modalErrors = [];
      this.userModel.name = null;
      this.userModel.lastName = null;
      this.userModel.email = null;
      this.userModel.phone = null;
      this.userModel.actorType_id = null;
      this.userModel.office_id = null;
      this.userModel.isSuperUser = false;
      this.userModel.isGovernmen = false;
      this.userModel.additionalDetails = null;
    },
    cleanUserModelValid() {
      this.userModelValid.name = null;
      this.userModelValid.lastName = null;
      this.userModelValid.email = null;
      this.userModelValid.actorType_id = null;
    },
    loadCountries() {
      this.isLoading = true;
      utilsService
        .getCountries()
        .then(res => {
          this.countries = res.response;
          this.isLoading = false;
        })
        .catch(err => {
          this.countries = [];
          this.isLoading = false;
        });
    },
    loadRegions() {
      if (!this.selectedCountry) {
        this.officeModel.region_id = null;
        this.officeModel.country_id = null;
        this.officeModel.commune_id = null;
        return;
      }
      this.isLoading = true;
      utilsService
        .getRegionsInCountry(this.selectedCountry._id)
        .then(res => {
          this.regions = res.response;
          this.isLoading = false;
        })
        .catch(err => {
          this.regions = [];
          this.isLoading = false;
        });
    },
    loadCommunes() {
      this.isLoading = true;
      utilsService
        .getCommunesInRegion(this.selectedRegion._id)
        .then(res => {
          this.communes = res.response;
          this.isLoading = false;
          this.loadOffices();
        })
        .catch(err => {
          this.communes = [];
          this.isLoading = false;
          this.loadOffices();
        });
    },
    loadOffices() {
      if (!this.actorTypeSelected) return;

      this.isLoading = true;
      var region_id = this.selectedRegion ? this.selectedRegion._id : "";
      const commune_id = this.selectedCommune ? this.selectedCommune._id : "";

      if (commune_id != "") region_id = "";

      utilsService
        .getOfficesByActorType(
          this.actorTypeSelected._id,
          region_id,
          commune_id
        )
        .then(res => {
          this.offices = res.response;
          this.isLoading = false;
        })
        .catch(err => {
          this.offices = [];
          this.isLoading = false;
        });
    }
  }
};
</script>