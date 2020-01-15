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
          </stats-card>
        </div>
      </div>
      <br />
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <!--Tables-->
        <div class="col">
          <emergencies-table :tableData="emergencies" :error="emergenciesError"></emergencies-table>
        </div>
      </div>
      <!--End tables-->
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
import EmergenciesTable from "../Tables/EmergenciesTable";
import "vue-select/dist/vue-select.css";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

import { utilsService, emergencyService } from "../../services";

export default {
  components: {
    EmergenciesTable,
    Loading
  },
  data() {
    return {
      totalEmergenciasMes: 0, 
      isLoading: false,
      emergencyTypes: [],
      emergencies: {},
      emergenciesError: false,
      emergenciesIdViewed: []
    };
  },
  async created() {
    if (this.$loggedUser.isAdmin) {
      this.$router.push({ name: "Administrar Usuarios Admin" });
      return;
    }
    
    await this.loadEmergencies();

    await emergencyService.getCantEmergenciesInCurrentMonth().then(res => {
      this.totalEmergenciasMes = res.totalMonthEmergencies;
    }).catch(err => {
      this.totalEmergenciasMes = "Error al obtener el dato";
    });
  },
  mounted() {
    this.$socket.on("askforhelp", async data => {
    if (data.to == this.$loggedUser.actorType) {
        this.notify(data.from + " ha solicitado su ayuda!", null, "warning");
        this.loadEmergencies();
      }
    });
  },
  methods: {
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
          this.emergencies = [];
          this.emergenciesError = true;
          this.isLoading = false;
        });
    },
  }
};
</script>