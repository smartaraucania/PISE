<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8"></base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="mb-0">Usuarios APP</h2>
                </div>
                <div>
                  <base-button
                    type="success"
                    icon="ni ni-ambulance"
                    @click="showAddUser('app')"
                  >Agregar Usuario APP</base-button>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :data="appUsers"
                :error="errorAU"
              >
                <template slot="columns">
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Habilitado</th>
                  <th>Último Login</th>
                </template>

                <template slot-scope="{row}">
                  <td>{{row.name}} {{row.lastName}}</td>
                  <td>{{row.email}}</td>
                  <td>
                    <span v-if="!row.enabled" style="color: red; font-weight: bold">NO</span>
                    <span v-else
                      style="color: green; font-weight: bold"
                    >SI</span>
                  </td>
                  <td>{{row.loginHistory[row.loginHistory.length-1] ? $moment(row.loginHistory[row.loginHistory.length-1].date).format('HH:mm [el] DD/MM/YYYY')+' en '+row.loginHistory.location[row.loginHistory.length-1] : '-'}}</td>
                </template>
              </base-table>
            </div>
          </div>
        </div>
      </div>
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
              <h2>Agregar Usuario APP</h2>
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
                      <h4>Oficina/Cuartel</h4>
                    </label>
                    <br />
                    <label>
                      <h4>País Oficina/Cuartel*</h4>
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
                      <h4>Región Oficina/Cuartel*</h4>
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
                      <h4>Comuna Oficina/Cuartel</h4>
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
                  <span class="text-muted">* Campos requeridos</span>
                </div>
              </div>
              <div class="text-center">
                <base-button type="plain" class="my-4" @click="confirmCancelModal = true">Cancelar</base-button>
                <base-button type="danger" class="my-4" @click="checkAddUser()">Agregar Usuario APP</base-button>
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

const bus = this;

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
      appUsers: [],
      errorWU: null,
      errorAU: null,
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
    this.loadAppUsers();
    this.loadCountries();
  },
  methods: {
    loadAppUsers() {
      this.isLoading = true;
      userService
        .getAppUsers(this.$loggedUser.actorType)
        .then(res => {
          this.appUsers = res.response;
          this.isLoading = false;
        })
        .catch(res => {
          this.appUsers = [];
          this.isLoading = false;
          this.errorAU = true;
        });
    },
    loadWebUsers() {
      this.isLoading = true;
      userService
        .getWebUsers()
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
    showAddUser() {
      this.addUserModal = true;
      this.cleanUserModel();
      this.cleanUserModelValid();
    },
    confirmCancel() {
      this.confirmCancelModal = false;
      this.addUserModal = false;
    },
    checkAddUser() {
      this.cleanUserModelValid();
      this.modalErrors = [];
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
      this.isLoading = true;
      userService
        .addAppUser(this.userModel)
        .then(res => {
          this.loadAppUsers();
          this.addUserModal = false;
          this.isLoading = false;
          this.cleanUserModel();
          this.cleanUserModelValid();
        })
        .catch(err => {
          this.loadAppUsers();
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
      if (!this.selectedRegion) {
        this.officeModel.region_id = null;
        this.officeModel.commune_id = null;
        return;
      }
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
      this.isLoading = true;
      var region_id = this.selectedRegion ? this.selectedRegion._id : "";
      const commune_id = this.selectedCommune ? this.selectedCommune._id : "";

      if (commune_id != "") region_id = "";

      utilsService
        .getOfficesByActorType(
          this.$loggedUser.actorType,
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