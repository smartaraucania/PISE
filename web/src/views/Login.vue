<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center text-muted mb-4" v-if="confirmLogin">
            <h4 class="text-success">
              Se te ha enviado un código de confirmación a tu correo
            </h4>
          </div>
          <div class="text-center text-muted mb-4" v-if="errors">
            <h4
              class="text-danger"
              v-for="error in errors"
              v-bind:key="error.error"
            >
              {{ error.error }}
            </h4>
          </div>
          <form v-if="!confirmLogin" @submit.prevent="login">
            <base-input
              class="input-group-alternative mb-3"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
              v-model="model.email"
              :required="true"
              :valid="emailValid"
            ></base-input>

            <base-input
              class="input-group-alternative"
              placeholder="Contraseña"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
              v-model="model.password"
              :required="true"
              :valid="passwordValid"
            ></base-input>

            <div class="row justify-content-center">
              <div class="col-6">
                <a href="#" class="text-light">
                  <small>¿Olvidaste tu contraseña?</small>
                </a>
              </div>
            </div>
            <div class="text-center">
              <base-button type="primary" nativeType="submit" class="my-4"
                >Ingresar</base-button
              >
            </div>
          </form>

          <form v-if="confirmLogin" @submit.prevent="confirmLoginMethod">
            <base-input
              class="input-group-alternative mb-3"
              placeholder="Código"
              addon-left-icon="ni ni-email-83"
              v-model="confirmModel.code"
              :required="true"
              :valid="codeValid"
            ></base-input>

            <base-checkbox class="mb-3" v-model="confirmModel.remember"
              >¿Recordar?</base-checkbox
            >

            <div class="row justify-content-center">
              <div class="col text-center">
                <a href="#" class="text-light">
                  <small @click="sendNewCode()"
                    >¿El código no llega? Enviar otro</small
                  >
                </a>
              </div>
            </div>
            <div class="text-center">
              <base-button type="primary" nativeType="submit" class="my-4"
                >Confirmar</base-button
              >
            </div>
          </form>
        </div>
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
<script>
import { authService } from "../services";
var is = require("is_js");
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  components: {
    Loading
  },
  name: "Login",
  data() {
    return {
      isLoading: false,
      confirmLogin: false,
      errors: null,
      passwordValid: null,
      emailValid: null,
      codeValid: null,
      locationData: "",
      model: {
        email: "",
        password: ""
      },
      confirmModel: {
        code: "",
        remember: false
      }
    };
  },
  async created() {
    this.errors = JSON.parse(localStorage.getItem("errors"), null);
    localStorage.removeItem("errors");

    await fetch("http://ip-api.com/json")
      .then(res => {
        res.text().then(res => {
          var ipData = JSON.parse(res);
          this.locationData =
            this.findBrowserAndOS() +
            " " +
            ipData.city +
            "-" +
            ipData.country +
            " IP:" +
            ipData.query +
            " (" +
            ipData.org +
            ")";
        });
      })
      .catch(err => {
        this.locationData = "Sin información";
      });
  },
  methods: {
    login: function(e) {
      this.emailValid = null;
      this.passwordValid = null;

      if (this.model.email && this.model.password) {
        this.isLoading = true;
        authService
          .login(this.model.email, this.model.password, this.locationData)
          .then(response => {
            this.confirmLogin = true;
            this.errors = null;
            this.isLoading = false;
          })
          .catch(response => {
            this.errors = response;
            this.isLoading = false;
          });
      }

      if (!this.model.email) {
        this.emailValid = false;
      }
      if (!this.model.password) {
        this.passwordValid = false;
      }
      e.preventDefault();
      return false;
    },
    sendNewCode() {
      this.isLoading = true;
      authService
        .login(this.model.email, this.model.password, this.locationData)
        .then(response => {
          this.confirmLogin = true;
          this.errors = null;
          this.isLoading = false;
        })
        .catch(response => {
          this.errors = response;
          this.isLoading = false;
        });
    },
    confirmLoginMethod: function(e) {
      this.codeValid = null;
      if (this.confirmModel.code) {
        this.isLoading = true;
        authService
          .confirmLogin(
            this.confirmModel.code,
            this.confirmModel.remember,
            this.locationData
          )
          .then(response => {
            this.$router.push({ name: "inicio" });
          })
          .catch(response => {
            this.errors = response;
            this.isLoading = false;
          });
      }

      if (!this.confirmModel.code) {
        this.codeValid = false;
      }

      e.preventDefault();
      return false;
    },
    findBrowserAndOS() {
      var browser = is.chrome()
        ? "Chrome"
        : is.firefox()
        ? "Firefox"
        : is.safari()
        ? "Safari"
        : is.opera()
        ? "Opera"
        : is.edge()
        ? "Edge"
        : is.ie()
        ? "IE"
        : "Desconocido";
      var os = is.ios()
        ? "iOS"
        : is.iphone()
        ? "iPhone"
        : is.ipad()
        ? "iPad"
        : is.android()
        ? "Android"
        : is.androidTablet()
        ? "Android Tablet"
        : is.windowsPhone()
        ? "Windows Phone"
        : is.windows()
        ? "Windows"
        : is.mac()
        ? "Mac"
        : is.linux()
        ? "Linux"
        : "Desconocido";

      return browser + "/" + os;
    }
  }
};
</script>
<style></style>
