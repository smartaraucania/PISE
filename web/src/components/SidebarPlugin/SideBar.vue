<template>
  <nav
    class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white"
    id="sidenav-main"
  >
    <div class="container-fluid">
      <!--Toggler-->
      <navbar-toggle-button @click.native="showSidebar">
        <span class="navbar-toggler-icon"></span>
      </navbar-toggle-button>
      <router-link class="navbar-brand" to="/">
        <img :src="logo" class="navbar-brand-img" alt="..." />
      </router-link>

      <slot name="mobile-right">
        <ul class="nav align-items-center d-md-none">
          <base-dropdown class="nav-item" position="right">
            <a slot="title" class="nav-link" href="#" role="button">
              <div class="media align-items-center">
                <span class="avatar avatar-sm rounded-circle">
                  <img alt="Image placeholder" :src="profileImage" />
                </span>
              </div>
            </a>

            <div class="dropdown-header noti-title">
              <h6 class="text-overflow m-0">Hola, {{$loggedUser.name}}!</h6>
            </div>
            <router-link to="/profile" class="dropdown-item">
              <i class="ni ni-single-02"></i>
              <span>Perfil</span>
            </router-link>
            <router-link to="/profile" class="dropdown-item">
              <i class="ni ni-support-16"></i>
              <span>Ayuda</span>
            </router-link>
            <div class="dropdown-divider"></div>
            <router-link to="#" class="dropdown-item">
              <div @click="logout">
                <i class="ni ni-user-run"></i>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;Cerrar sesión</span>
              </div>
            </router-link>
          </base-dropdown>
        </ul>
      </slot>
      <slot></slot>
      <div
        v-show="$sidebar.showSidebar"
        class="navbar-collapse collapse show"
        id="sidenav-collapse-main"
      >
        <ul class="navbar-nav">
          <slot name="links"></slot>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import NavbarToggleButton from "@/components/NavbarToggleButton";
import {authService} from '../../services';

export default {
  name: "sidebar",
  components: {
    NavbarToggleButton
  },
  props: {
    logo: {
      type: String,
      default: "",
      description: "PISE logo"
    },
    autoClose: {
      type: Boolean,
      default: true,
      description:
        "Whether sidebar should autoclose on mobile when clicking an item"
    },
    profileImage: {
      type: String,
      default: require('@/assets/img/user_default.png')
    }
  },
  provide() {
    return {
      autoClose: this.autoClose
    };
  },
  methods: {
    closeSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    showSidebar() {
      this.$sidebar.displaySidebar(true);
    },
    logout(){
        authService.logout().then(() => {
          location.reload();
        }).catch(() => {
          location.reload();
        })
      }
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
    }
  }
};
</script>
