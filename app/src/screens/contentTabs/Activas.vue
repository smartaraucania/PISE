<template>
  <view>
    <nb-card v-for="activa in activas" :key="activa._id">
      <nb-card-item button :onPress="() => onPressEmergency(activa)">
        <nb-grid>
          <nb-row
            :size="0.3"
            v-if="activa.isNew"
            :style="{alignItems: 'center', justifyContent: 'center'}"
          >
            <nb-icon name="md-alert" :style="{ fontSize: 20, color: 'red'}" />
          </nb-row>
          <nb-row>
            <nb-col :size="5" :style="{alignItems: 'flex-start', justifyContent: 'flex-start'}">
              <nb-text class="title">EMERGENCIA ACTIVA</nb-text>
            </nb-col>
            <nb-col :size="5" :style="{alignItems: 'flex-end', justifyContent: 'flex-end'}">
              <nb-text class="date">{{ $moment(activa.date).format('DD MMM YYYY HH:mm') }}</nb-text>
            </nb-col>
          </nb-row>
          <nb-row :size="1">
            <nb-text class="date">&#xA;</nb-text>
          </nb-row>
          <nb-row :size="1">
            <nb-text
              class="title"
            >{{ activa.emergencyType_id.name }} {{activa.emergencyType_id.description.toUpperCase()}}</nb-text>
          </nb-row>
          <nb-row :size="1">
            <nb-text class="subtitle">{{activa.address }}</nb-text>
          </nb-row>

          <nb-row :size="1">
            <nb-text class="event">
              {{activa.lastEvent
              ? activa.lastEvent.eventType_id.name.toUpperCase() +
              " por " +
              activa.lastEvent.user
              : "CREADA"}}
            </nb-text>
          </nb-row>

          <nb-col :size="1">
            <nb-text class="data">por {{ activa.actorType_id.name.toUpperCase() }}</nb-text>
          </nb-col>
        </nb-grid>
      </nb-card-item>
    </nb-card>
  </view>
</template>

<style>
.title {
  color: black;
  font-size: 14;
  font-weight: bold;
}
.subtitle {
  color: black;
  font-size: 12;
}
.event {
  font-weight: bold;
  color: black;
  font-size: 12;
}
.new {
  text-align: right;
}
.data {
  color: black;
  font-size: 12;
  text-align: right;
}
.date {
  text-align: right;
  font-size: 14;
}
</style>

<script>
export default {
  props: {
    navigation: {
      type: Object
    },
    activas: {
      type: Array
    }
  },
  beforeCreate() {},
  created() {},
  methods: {
    onPressEmergency(emergency) {
      if(emergency.isNew){
        this.$store.commit("decrementEmergenciesWithoutRead");
        emergency.isNew = false;
        emergency.address = emergency.address+" ";
      }
      this.navigation.navigate("EmergencyDetails", { emergency: emergency });
    }
  }
};
</script>