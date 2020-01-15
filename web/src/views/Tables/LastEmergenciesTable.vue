<template>
  <div class="card shadow">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h2 class="mb-0">Últimas Emergencias</h2>
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

        <template slot-scope="{row}">
          <td :bgcolor="row.isNew ? 'yellow' : row.finalized ? '#EAEAEA' : ''" @click="showEmergency(row)">{{ $moment(row.date).format("DD-MMMM-YY H:mm")}}</td>
          <td :bgcolor="row.isNew ? 'yellow' : row.finalized ? '#EAEAEA' : ''" @click="showEmergency(row)">{{row.actorType_id.name ? row.actorType_id.name.toUpperCase() : '-'}}</td>
          <td :bgcolor="row.isNew ? 'yellow' : row.finalized ? '#EAEAEA' : ''" @click="showEmergency(row)">{{row.emergencyType_id ? row.emergencyType_id.name.toUpperCase() : '-'}}</td>
          <td :bgcolor="row.isNew ? 'yellow' : row.finalized ? '#EAEAEA' : ''" @click="showEmergency(row)">{{row.address}}</td>
          <td style="color: red" :bgcolor="row.isNew ? 'yellow' : row.finalized ? '#EAEAEA' : ''" @click="showEmergency(row)">{{row.lastEvent ? row.lastEvent.eventType_id.name.toUpperCase()+" por "+row.lastEvent.user : 'CREADA'}}</td>
        </template>
      </base-table>
    </div>
  </div>
</template>
<style>
.clickeable {
  cursor: pointer;
}
</style>
<script>
import { emergencyService } from '../../services'

export default {
  name: "lastEmergencies-table",
  props:{
    tableData:{
      type: Object,
      default: {}
    },
    error: {
      type: Boolean,
      default: false
    },
  },
  created() {
  },
  data() {
    return {
    };
  },
  methods: {
    showEmergency(emergency) {
      localStorage.setItem('emergency_id', emergency._id);
      this.$router.push({ name: 'Emergencia', params: { emergency_id: emergency._id } });
    },
  }
};
</script>
<style>
</style>
