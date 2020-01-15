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
      <div class="row">
        <!--Tables-->
        <div class="col" v-if="actorTypes">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h2
                    class="mb-0"
                  >Tipos de Actores de {{ actorGroupTypeSelected.groupName.toUpperCase() }}</h2>
                </div>
                <div>
                  <base-button
                    type="success"
                    icon="fa fa-plus-circle"
                    @click="showAddTipoDeActor()"
                  >Agregar Tipo de Actor a {{ actorGroupTypeSelected.groupName.toUpperCase() }}</base-button>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list clickeable"
                type="hover"
                :data="actorTypes"
                :error="errorAT"
              >
                <template slot="columns">
                  <th>Nombre</th>
                  <th>Logo</th>
                </template>

                <template slot-scope="{row}">
                  <td @click="showEditActorType(row)">{{(row.name).toUpperCase()}}</td>
                  <td @click="showEditActorType(row)">
                    <div class="avatar rounded-circle mr-3">
                      <a target="_blank" :href="row.logoURL">
                        <img :src="row.logoURL" />
                      </a>
                    </div>
                  </td>
                </template>
              </base-table>
            </div>
          </div>
        </div>
        <div class="col" v-else>
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="mb-0 text-center">ESCOGE UN GRUPO DE ACTORES A MOSTRAR</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--End tables-->
    </div>

    <!-- MODAL: ADD ACTOR TYPE -->
    <div class="col-md-4" v-if="actorGroupTypeSelected">
      <modal
        :closeInBackground="false"
        :show.sync="addActorTypeModal"
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
              <h2>Agregar Tipo de Actor a {{ actorGroupTypeSelected.groupName.toUpperCase() }}</h2>
            </div>
          </template>
          <template>
            <form enctype="multipart/form-data" @submit.prevent="addActorType">
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4>Nombre*</h4>
                    </label>
                    <base-input required v-model="actorTypeModel.name"></base-input>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label for="privacity">
                      <h4>Logo</h4>
                    </label>
                    <br />
                    <input type="file" ref="logo" @change="selectFile" />
                    <br />
                    <span
                      class="text-muted"
                      style="font-size: 12px"
                    >Se recomienda usar imagen cuadrada para no perder proporción</span>
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
                  @click="addActorType()"
                >Agregar Tipo de Actor</base-button>
              </div>
            </form>
          </template>
        </card>
      </modal>
    </div>

    <!-- MODAL: EDIT ACTOR TYPE -->
    <div class="col-md-4" v-if="editActorTypeModal">
      <modal
        :closeInBackground="false"
        :show.sync="editActorTypeModal"
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
              <h2>Tipo de Actor: {{ actorTypeModel.name.toUpperCase() }}</h2>
            </div>
          </template>
          <template>
            <form enctype="multipart/form-data" @submit.prevent="editActorType">
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4>Nombre*</h4>
                    </label>
                    <base-input required v-model="actorTypeModel.name"></base-input>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label for="privacity">
                      <h4>Logo</h4>
                    </label>
                    <br />
                    <div class="avatar rounded-circle mr-3">
                      <a target="_blank" :href="actorTypeModel.logo">
                        <img :src="actorTypeModel.logo" />
                      </a>
                    </div>
                    <input type="file" ref="logoEdit" @change="selectFile" />
                    <br />
                    <span
                      class="text-muted"
                      style="font-size: 12px"
                    >Se recomienda usar imagen cuadrada para no perder proporción</span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <span class="text-muted">* Campos requeridos</span>
                </div>
              </div>
              <div class="row">
                <div class="card col">
                  <div class="card-header border-0">
                    <div class="row align-items-center">
                      <div class="col">
                        <h2 class="mb-0">Oficinas</h2>
                      </div>
                      <div>
                        <base-button
                          type="success"
                          icon="ni ni-ambulance"
                          @click="showAddOffice()"
                        >Agregar Oficina</base-button>
                      </div>
                    </div>
                  </div>
                  <div class="table-responsive">
                    <base-table
                      class="table align-items-center table-flush"
                      thead-classes="thead-light"
                      tbody-classes="list clickeable"
                      type="hover"
                      :data="actorTypeOffices"
                      :error="errorATO"
                    >
                      <template slot="columns">
                        <th>Nombre</th>
                        <th>Lugar</th>
                      </template>

                      <template slot-scope="{row}">
                        <td>{{(row.name).toUpperCase()}}</td>
                        <td>{{ row.commune_id != null ? row.commune_id.name.toUpperCase()+', ' : '' }} {{row.region_id.name.toUpperCase()}}</td>
                      </template>
                    </base-table>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <base-button type="success" class="my-4" @click="editActorType()">Guardar</base-button>
              </div>
            </form>
          </template>
        </card>
      </modal>
    </div>

    <!-- MODAL: ADD OFFICE -->
    <div class="col-md-4" v-if="addOfficeModal">
      <modal
        :closeInBackground="false"
        :show.sync="addOfficeModal"
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
              <h2>Agregar Oficina a {{actorTypeModel.name}}</h2>
            </div>
          </template>
          <template>
            <form enctype="multipart/form-data" @submit.prevent="addOffice">
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4>Nombre</h4>
                    </label>
                    <base-input v-model="officeModel.name"></base-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>
                      <h4>País*</h4>
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
                      <template slot="selected-option" slot-scope="option">{{ option.name.toUpperCase() }}</template>
                      <span slot="no-options">No encontrado.</span>
                    </v-select>
                  </div>
                </div>
                <div class="col" v-if="selectedCountry">
                  <div class="form-group">
                    <label>
                      <h4>Región*</h4>
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
                      <template slot="selected-option" slot-scope="option">{{ option.name.toUpperCase() }}</template>
                      <span slot="no-options">No encontrado.</span>
                    </v-select>
                  </div>
                </div>
                <div class="col" v-if="selectedRegion">
                  <div class="form-group">
                    <label>
                      <h4>Comuna</h4>
                    </label>
                    <v-select
                      v-model="selectedCommune"
                      :options="communes"
                      label="name"
                      :required="!selectedCommune"
                      :placeholder="'Seleciona una Comuna'"
                    >
                      <template slot="option" slot-scope="option">{{ option.name.toUpperCase() }}</template>
                      <template slot="selected-option" slot-scope="option">{{ option.name.toUpperCase() }}</template>
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
                <base-button type="danger" class="my-4" @click="addOffice">Agregar Oficina</base-button>
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

.clickeable {
  cursor: pointer;
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
      addActorTypeModal: false,
      editActorTypeModal: false,
      confirmCancelModal: false,
      actorsGroupTypes: [],
      actorTypes: null,
      errorAT: null,
      actorTypeModel: {
        _id: null,
        name: null,
        logo: null
      },
      actorGroupTypeSelected: null,
      actorTypeOffices: [],
      errorATO: null,
      addOfficeModal: false,
      currentModal: null,
      officeModel: {
        name: null,
        region_id: null,
        commune_id: null,
        actorType_id: null
      },
      countries: [],
      regions: [],
      communes: [],
      selectedCountry: null,
      selectedRegion: null,
      selectedCommune: null,
    };
  },
  created() {
    this.loadCountries();
    this.loadActorsGroupType();
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
    loadActorsType(actorsGroupType) {
      this.actorGroupTypeSelected = actorsGroupType;
      this.isLoading = true;
      utilsService
        .getActorTypesByActorsGroup(actorsGroupType._id)
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
    showAddTipoDeActor() {
      this.addActorTypeModal = true;
      this.currentModal = "addActorType";
    },
    confirmCancel() {
      if (this.currentModal == "addActorType") {
        this.confirmCancelModal = false;
        this.addActorTypeModal = false;
        this.actorTypeModel.name = null;
        this.actorTypeModel.logo = null;
        this.$refs.logo.files = null;
        this.$refs.logo.value = null;
        this.currentModal = null;
      } else if (this.currentModal == "editActorType") {
        this.editActorTypeModal = false;
        this.actorTypeModel._id = null;
        this.actorTypeModel.name = null;
        this.actorTypeModel.logo = null;
        this.confirmCancelModal = false;
        this.$refs.logoEdit.files = null;
        this.$refs.logoEdit.value = null;
        this.currentModal = null;
      } else if (this.currentModal == "addOfice") {
        this.addOfficeModal = false;
        this.confirmCancelModal = false;
        this.currentModal = "editActorType";
      }
    },
    addActorType() {
      const formData = new FormData();
      formData.append("logo", this.actorTypeModel.logo);
      formData.append("name", this.actorTypeModel.name);

      this.isLoading = true;
      utilsService
        .addActorTypeToActorsGroup(this.actorGroupTypeSelected._id, formData)
        .then(res => {
          this.isLoading = false;
          this.loadActorsType(this.actorGroupTypeSelected);
          this.addActorTypeModal = false;
          this.actorTypeModel.name = null;
          this.actorTypeModel.logo = null;
          this.$refs.logo.files = null;
          this.$refs.logo.value = null;
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
    },
    showEditActorType(actorType) {
      this.actorTypeModel._id = actorType._id;
      this.actorTypeModel.name = actorType.name;
      this.actorTypeModel.logo = actorType.logoURL;
      this.editActorTypeModal = true;
      this.loadOffices(actorType);
      this.currentModal = "editActorType";
    },
    editActorType() {
      this.isLoading = true;
      this.actorTypeModel.logo = this.$refs.logoEdit.files[0]
        ? this.$refs.logoEdit.files[0]
        : this.actorTypeModel.logo;
      const formData = new FormData();
      formData.append("logo", this.actorTypeModel.logo);
      formData.append("name", this.actorTypeModel.name);

      utilsService
        .editActorType(this.actorTypeModel._id, formData)
        .then(res => {
          this.isLoading = false;
          this.loadActorsType(this.actorGroupTypeSelected);
          this.editActorTypeModal = false;
          this.actorTypeModel._id = null;
          this.actorTypeModel.name = null;
          this.actorTypeModel.logo = null;
          this.$refs.logoEdit.files = null;
          this.$refs.logoEdit.value = null;
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
    },
    loadOffices(actorType) {
      this.isLoading = true;
      utilsService
        .getOfficesByActorType(actorType._id)
        .then(res => {
          this.actorTypeOffices = res.response;
          this.isLoading = false;
        })
        .catch(err => {
          this.actorTypeOffices = [];
          this.isLoading = false;
          this.errorATO = true;
        });
    },
    showAddOffice() {
      this.addOfficeModal = true;
      this.currentModal = "addOfice";
    },
    addOffice() {
      if(!this.selectedRegion) {
        return;
      }
      if(!this.officeModel.name) {
        return;
      }
      this.isLoading = true;
      this.officeModel.region_id = this.selectedRegion ? this.selectedRegion._id : null;
      this.officeModel.commune_id = this.selectedCommune ? this.selectedCommune._id : null;
      this.officeModel.actorType_id = this.actorTypeModel._id;
      utilsService.addOfficeToActorType(this.officeModel).then(res => {
        this.loadOffices(this.actorTypeModel);
        this.officeModel = null;
        this.addOfficeModal = false;
        this.isLoading = false;
      }).catch(err => {
        console.log(err)
        this.isLoading = false;
      });
    },
    selectFile() {
      this.actorTypeModel.logo = this.$refs.logo.files[0];
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
      if(!this.selectedCountry){
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
        })
        .catch(err => {
          this.communes = [];
          this.isLoading = false;
        });
    }
  }
};
</script>