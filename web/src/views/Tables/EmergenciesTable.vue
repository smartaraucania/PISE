<template>
  <div class="card shadow">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h2 class="mb-0">Emergencias</h2>
        </div>
        <div class="col text-right" v-if="!$loggedUser.isGovernment">
          <base-button
            :outline="public_outline"
            :type="public_type"
            @click="filterPublic"
            >{{ textPublicButton }}</base-button
          >
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <base-table
        class="table align-items-center table-flush"
        thead-classes="thead-light"
        tbody-classes="list clickeable"
        type="hover"
        :data="tableData.response"
        :error="error"
      >
        <template slot="columns">
          <th>Fecha</th>
          <th>Actor</th>
          <th>Tipo de Emergencia</th>
          <th>Dirección</th>
          <th>Estado</th>
        </template>

        <template slot-scope="{ row }">
          <td :bgcolor="row.isNew ? 'yellow' : row.finalized ? '#EAEAEA' : ''" @click="showEmergency(row)">
            {{ $moment(row.date).format("DD-MMMM-YY H:mm") }}
          </td>
          <td :bgcolor="row.isNew ? 'yellow' : row.finalized ? '#EAEAEA' : ''" @click="showEmergency(row)">
            {{
              row.actorType_id.name ? row.actorType_id.name.toUpperCase() : "-"
            }}
          </td>
          <td
            :bgcolor="row.isNew ? 'yellow' : row.finalized ? '#EAEAEA' : ''"
            @click="showEmergency(row)"
            :title="row.emergencyType_id.description"
          >
            {{
              row.emergencyType_id
                ? row.emergencyType_id.name.toUpperCase()
                : "-"
            }}
          </td>
          <td :bgcolor="row.isNew ? 'yellow' : row.finalized ? '#EAEAEA' : ''" @click="showEmergency(row)">
            {{ row.address }}
          </td>
          <td style="color: red" :bgcolor="row.isNew ? 'yellow' : row.finalized ? '#EAEAEA' : ''" @click="showEmergency(row)">
            {{ row.lastEvent ? row.lastEvent.eventType_id.name.toUpperCase()+" por "+row.lastEvent.user : "CREADA" }}
          </td>
        </template>
      </base-table>
      <div>
        <base-pagination
          @input="loadEmergencies(currentPage, finalized)"
          v-model="currentPage"
          class="mr-4"
          :pageCount="tableData.pages"
          :perPage="tableData.limit"
          :total="tableData.total"
          align="end"
        ></base-pagination>
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
.clickeable {
  cursor: pointer;
}
</style>
<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

import { emergencyService } from "../../services";

export default {
  name: "emergencies-table",
  components: {
    Loading
  },
  props: {
    tableData: {
      type: Object,
      default: {}
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      textPublicButton: "Incluir Públicas",
      verPublicas: false,
      public_outline: true,
      public_type: "secondary",
      currentPage: 1,
      selectedActorType: null,
      finalized: null
    };
  },
  methods: {
    showEmergency(emergency) {
      localStorage.setItem("emergency_id", emergency._id);
      this.$router.push({
        name: "Emergencia",
        params: { emergency_id: emergency._id }
      });
    },
    filterPublic() {

    },
    loadEmergencies(page, finalized) {
      this.isLoading = true;
      emergencyService
        .getAllByUserLogged(page, finalized)
        .then(async res => {
          this.tableData = res;
          this.$store.commit("setEmergencies", res);
          this.tableData = this.$store.getters.getEmergencies;
          this.emergenciesIdViewed = this.$store.getters.getEmergenciesIdViewed;
          if (this.emergenciesIdViewed == null) this.emergenciesIdViewed = [];
          this.tableData.response.forEach(emergency => {
            if (this.emergenciesIdViewed.indexOf(emergency._id) == -1) {
              emergency.isNew = true;
            }
          });
          await localStorage.setItem('emergenciesIdViewed', JSON.stringify(this.emergenciesIdViewed));
          this.emergenciesError = false;
          this.isLoading = false;
        })
        .catch(err => {
          this.tableData = [];
          this.emergenciesError = true;
          this.isLoading = false;
        });
    },
    loadPublicEmergencies() {
      this.isLoading = true;
      if(this.$loggedUser.isGovernment){
        this.selectedActorType = "1awsas";
      }
      emergencyService
        .getAllByActorType(this.currentPage, this.selectedActorType)
        .then(async res => {
         this.tableData = res;
          this.$store.commit("setEmergencies", res);
          this.tableData = this.$store.getters.getEmergencies;
          this.emergenciesIdViewed = this.$store.getters.getEmergenciesIdViewed;
          if (this.emergenciesIdViewed == null) this.emergenciesIdViewed = [];
          this.tableData.response.forEach(emergency => {
            if (this.emergenciesIdViewed.indexOf(emergency._id) == -1) {
              emergency.isNew = true;
            }
          });
          await localStorage.setItem('emergenciesIdViewed', JSON.stringify(this.emergenciesIdViewed));
          this.emergenciesError = false;
          this.isLoading = false;
        })
        .catch(err => {
          this.tableData = [];
          this.emergenciesError = true;
          this.isLoading = false;
        });
    }
  }
};
</script>
<style></style>
