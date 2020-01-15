<template>
    <base-nav class="navbar-top navbar-dark"
              id="navbar-main"
              :show-toggle-button="false"
              expand>
        <div class="ml-lg-auto">
        </div>
        <ul class="navbar-nav align-items-center d-none d-md-flex">
            <li class="nav-item dropdown">
                <base-dropdown class="nav-link pr-0">
                    <div class="media align-items-center" slot="title">
                <span class="avatar avatar-sm rounded-circle">
                  <img alt="Image placeholder" :src="profileImage">
                </span>
                        <div class="media-body ml-2 d-none d-lg-block">
                            <span class="mb-0 text-sm  font-weight-bold">{{ $loggedUser.name }} {{ $loggedUser.lastName }}</span>
                        </div>
                    </div>

                    <template>
                        <div class=" dropdown-header noti-title">
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
                    </template>
                </base-dropdown>
            </li>
        </ul>
    </base-nav>
</template>
<script>
import {authService} from '../services';

  export default {
    data() {
      return {
        activeNotifications: false,
        showMenu: false,
        searchQuery: '',
        profileImage: ''
      };
    },
    created(){
      this.profileImage = require('@/assets/img/user_default.png');
    },
    methods: {
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      logout(){
        authService.logout().then(() => {
          location.reload();
        }).catch(() => {
          location.reload();
        })
      }
    }
  };
</script>
