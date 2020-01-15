<template>
  <nb-container class="container">
    <!-- Login -->
    <view v-if="!confirmarLogin">
      <nb-form>
        <nb-item floatingLabel :error="email_error">
          <nb-label>Email</nb-label>
          <nb-input v-model="email" />
        </nb-item>
        <nb-item floatingLabel :error="password_error">
          <nb-label>Password</nb-label>
          <nb-input v-model="password" secureTextEntry />
        </nb-item>
      </nb-form>
      <nb-button
        :disabled="loading"
        :onPress="login"
        block
        :style="{ margin: 16, marginTop: 50 }"
      >
        <nb-text>Ingresar</nb-text>
      </nb-button>
    </view>
    <!-- Confimar login -->
    <view v-else>
      <nb-form>
        <nb-item floatingLabel :error="codigo_error">
          <nb-label>Código</nb-label>
          <nb-input v-model="codigo" />
        </nb-item>
        <nb-list :style="{ marginTop: 25, margin: 16 }">
          <nb-list-item :onPress="recordarHandle">
            <nb-checkbox :onPress="recordarHandle" :checked="recordar" />
            <nb-body>
              <nb-text>¿Recordar?</nb-text>
            </nb-body>
          </nb-list-item>
        </nb-list>
      </nb-form>
      <nb-button
        :disabled="loading"
        :onPress="confirmLogin"
        block
        :style="{ margin: 16, marginTop: 50 }"
      >
        <nb-text>Ingresar</nb-text>
      </nb-button>
    </view>
  </nb-container>
</template>

<style>
.container {
  background-color: #fff;
  justify-content: center;
  flex: 1;
  margin: 16;
}
</style>

<script>
import React from "react";
import { Platform, AsyncStorage } from "react-native";
import { Toast } from "native-base";

import { authService } from "../services";

export default {
  props: {
    navigation: {
      type: Object
    }
  },
  data() {
    return {
      locationData: "",
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      email: "",
      password: "",
      email_error: false,
      password_error: false,
      loading: false,
      confirmarLogin: false,
      codigo: "",
      codigo_error: false,
      recordar: false
    };
  },
  async created() {
    if (this.$token) {
        this.navigation.navigate("App");
    }
    
    await fetch("http://ip-api.com/json")
      .then(res => {
        res.text().then(res => {
          var ipData = JSON.parse(res);
          this.locationData =
            Platform.OS.toUpperCase() +
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
    login() {
      this.password_error = false;

      this.email_error =
        this.email == "" ? true : this.reg.test(this.email) ? false : true;
      if (this.password.length < 4) {
        this.password_error = true;
      }

      if (this.email_error || this.password_error) {
        return;
      }

      this.loading = true;
      authService
        .login(this.email, this.password, this.locationData)
        .then(res => {
          this.loading = false;
          this.confirmarLogin = true;
        })
        .catch(err => {
          Toast.show({
            text: err[0].error,
            buttonText: "Ok",
            type: "danger",
            duration: 3000
          });
          this.loading = false;
        });
    },
    confirmLogin() {
      this.codigo_error = false;

      if (this.codigo_error.length < 5) {
        this.codigo_error = true;
      }

      if (this.codigo_error) {
        return;
      }

      this.loading = true;
      authService
        .confirmLogin(this.codigo, this.recordar, this.locationData)
        .then(res => {
          this.loading = false;
          this.navigation.navigate("App");
        })
        .catch(err => {
          this.loading = false;
          Toast.show({
            text: err[0].error,
            buttonText: "Ok",
            type: "danger",
            duration: 3000
          });
        });
    },
    recordarHandle() {
      this.recordar = this.recordar ? false : true;
    }
  }
};
</script>
