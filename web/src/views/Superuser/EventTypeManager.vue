<template>
  <div>
    <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
    </base-header>

    <div class="container-fluid mt--7">
      <br />
      <div class="row">
        <!--Tables-->
        <div class="col">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="mb-0">Tipos de Eventos</h2>
                </div>
                <div class="col">
                  <base-button
                    :outline="public_outline"
                    :type="public_type"
                    @click="filterPublic"
                    >{{ textPublicButton }}</base-button
                  >
                </div>
                <div>
                  <base-button
                    type="success"
                    icon="ni ni-ambulance"
                    @click="showAddEventType()"
                    >Agregar Tipo de Evento</base-button
                  >
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

                <template slot-scope="{ row }">
                  <td>{{ row.name.toUpperCase() }}</td>
                  <td>{{ row.description ? row.description : "-" }}</td>
                  <td>
                    {{
                      row.actorType_id
                        ? row.actorType_id.name.toUpperCase()
                        : "-"
                    }}
                  </td>
                </template>
              </base-table>
            </div>
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
                  <span class="text-muted">* Campos requeridos</span>
                </div>
              </div>
              <div class="text-center">
                <base-button
                  type="plain"
                  class="my-4"
                  @click="confirmCancelModal = true"
                  >Cancelar</base-button
                >
                <base-button type="success" class="my-4" @click="addEventType()"
                  >Agregar Tipo de Evento</base-button
                >
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
          <h6 slot="header" class="modal-title" id="modal-title-notification">
            Confirma la siguiente acción
          </h6>

          <div class="py-3 text-center">
            <i class="fa fa-exclamation-triangle ni-3x"></i>
            <h4 class="heading mt-4">Cuidado!</h4>
            <p>¿Desea cancelar la acción y perder todos los cambios?</p>
          </div>

          <template slot="footer">
            <base-button type="white" @click="confirmCancel()"
              >Si, cancelar</base-button
            >
            <base-button
              type="link"
              text-color="white"
              class="ml-auto"
              @click="confirmCancelModal = false"
              >No</base-button
            >
          </template>
        </modal>
      </div>
    </div>
    <div class="vld-parent">
      <loading
        :active.sync="isLoading"
        :can-cancel="true"
        :is-full-page="true"
      ></loading>
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
      public_outline: false,
      public_type: "default",
      textPublicButton: "No Incluir Públicas",
      isLoading: false,
      addEventTypeModal: false,
      confirmCancelModal: false,
      eventTypes: [],
      error: null,
      eventType: {
        actorTypeId: this.$loggedUser.actorType,
        name: null,
        description: null
      },
      showPublicTE: true
    };
  },
  created() {
    this.loadEventTypes(this.$loggedUser.actorType);
  },
  methods: {
    loadEventTypes(actorType) {
        this.isLoading = true;
      utilsService
        .getEventTypeByActorsType(actorType, this.showPublicTE)
        .then(res => {
          this.eventTypes = res.response;
          this.isLoading = false;
        })
        .catch(res => {
          this.eventTypes = [];
          this.isLoading = false;
        });
    },
    showAddEventType() {
      this.cleanAddEvent();
      this.error = null;
      this.addEventTypeModal = true;
    },
    confirmCancel() {
      this.confirmCancelModal = false;
      this.addEventTypeModal = false;
    },
    addEventType() {
      this.isLoading = true;
      utilsService
        .addEventTypeToActorType(this.eventType)
        .then(res => {
          this.loadEventTypes(this.$loggedUser.actorType);
          this.addEventTypeModal = false;
          this.isLoading = false;
        })
        .catch(err => {
          this.loadEventTypes(this.$loggedUser.actorType);
          this.isLoading = false;
        });
    },
    cleanAddEvent() {
      this.eventType.actorTypeId = this.$loggedUser.actorType;
      this.eventType.name = null;
      this.eventType.description = null;
    },
    filterPublic() {
      if (!this.showPublicTE) {
        this.showPublicTE = true;
        this.public_outline = false;
        this.public_type = "default";
        this.textPublicButton = "No Incluir Públicas";
      } else {
        this.showPublicTE = false;
        this.public_outline = true;
        this.public_type = "secondary";
        this.textPublicButton = "Incluir Públicas";
      }
      this.loadEventTypes(this.$loggedUser.actorType);
    }
  }
};
</script>
