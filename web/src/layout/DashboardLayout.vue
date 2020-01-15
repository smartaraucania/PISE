<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
      short-title="PISE web"
      title="Panel | PISE"
    >
      <template slot="links">
        <sidebar-item
          v-if="!$loggedUser.isAdmin"
          :link="{
            name: 'Inicio',
            icon: 'ni ni-ungroup text-blue',
            path: '/home'
          }"
        />
        <sidebar-item
          v-if="!$loggedUser.isAdmin"
          :link="{
            name: 'Emergencias',
            icon: 'ni ni-ambulance text-red',
            path: '/emergencies'
          }"
        />
        <div v-if="$loggedUser.isSuperUser">
          <div>
            <hr class="my-3" />
          </div>
          <sidebar-item
            :link="{
              name: 'Administrar Usuarios',
              icon: 'fa fa-users text-black',
              path: '/users'
            }"
          />
          <sidebar-item
            :link="{
              name: 'Administrar Tipos de Emergencia',
              icon: 'fa fa-heartbeat text-black',
              path: '/emergencyTypes'
            }"
          />
          <sidebar-item
            :link="{
              name: 'Administrar Tipos de Eventos',
              icon: 'fa fa-calendar text-black',
              path: '/eventsTypes'
            }"
          />
        </div>
        <div v-if="$loggedUser.isAdmin">
          <div>
            <hr class="my-3" />
          </div>
          <sidebar-item
            :link="{
              name: 'Administrar Usuarios',
              icon: 'fa fa-users text-black',
              path: '/admin/users'
            }"
          />
          <sidebar-item
            :link="{
              name: 'Administrar Actores',
              icon: 'fa fa-sitemap text-black',
              path: '/admin/actors'
            }"
          />
          <sidebar-item
            :link="{
              name: 'Administrar Tipos de Emergencia',
              icon: 'fa fa-heartbeat text-black',
              path: '/admin/emergencyTypes'
            }"
          />
          <sidebar-item
            :link="{
              name: 'Administrar Tipos de Eventos',
              icon: 'fa fa-calendar text-black',
              path: '/admin/eventsTypes'
            }"
          />
          <sidebar-item
            :link="{
              name: 'Administrar Utilitarios',
              icon: 'ni ni-badge text-black',
              path: '/admin/utils'
            }"
          />
        </div>
      </template>
    </side-bar>

    <div class="main-content" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>

      <div @click="toggleSidebar">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <router-view></router-view>
        </fade-transition>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </div>
    </div>
  </div>
</template>
<script>
import DashboardNavbar from "./DashboardNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import { FadeTransition } from "vue2-transitions";
var constants = require("../constants");

const asyncLocalStorage = {
  setItem: function(key, value) {
    return Promise.resolve().then(function() {
      localStorage.setItem(key, value);
    });
  },
  getItem: function(key) {
    return Promise.resolve().then(function() {
      return localStorage.getItem(key);
    });
  }
};

import io2 from "socket.io-client";

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    FadeTransition
  },
  data() {
    return {
      sidebarBackground: "vue", //vue|blue|orange|green|red|primary
      emergency: null
    };
  },
  async mounted() {
    if (localStorage.getItem("notify")) {
      var app = this;
      asyncLocalStorage.getItem("notify").then(function(value) {
        var notifyObj =  JSON.parse(value);
        app.notify(notifyObj.msg, null, notifyObj.type);
        localStorage.removeItem("notify");
      });
    }

    this.$socket.on("newEmergency", data => {
      if (this.$loggedUser.isGovernment) {
        this.$notify({
          message:
            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nueva emergencia!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
          icon: "fa fa-bell",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "danger",
          timeout: 0
        });
        this.playSound(require("@/assets/sound/noti.mp3"));
      }
    });

    this.$socket.on("replaceEmergency", data => {
      this.notify(
        "Refresca la página! Han añadido nuevos detalles a la emergencia"
      );
    });

    this.$socket.on("newEvent", data => {
      this.notify(
        "Refresca la página! Han añadido nuevos detalles a la emergencia"
      );
    });

    this.$socket.on("notifyroadto", async data => {
      if (
        data.to._id == this.$loggedUser.actorType &&
        data.from != this.$loggedUser.name + " " + this.$loggedUser.lastName
      ) {
        var notify = {
          msg: data.from + " va en camino!",
          type: "info"
        };
        this.notify(data.from + " va en camino!", null, "info");
        // asyncLocalStorage
        //   .setItem("notify", JSON.stringify(notify))
        //   .then(function() {
        //     ///window.location.reload();
        //   });
      }
    });

    this.$socket.on("askforhelp", async data => {
      if (data.to == this.$loggedUser.actorType) {
        // var notify = {
        //   msg: data.from + " ha solicitado su ayuda!",
        //   type: "warning"
        // };
        this.notify(data.from + " ha solicitado su ayuda!", null, "warning");
        // asyncLocalStorage
        //   .setItem("notify", JSON.stringify(notify))
        //   .then(function() {
        //     window.location.reload();
        //   });
      }
    });
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>
<style lang="scss"></style>
