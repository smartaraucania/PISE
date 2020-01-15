<template>
  <root>
    <app-navigation></app-navigation>
  </root>
</template>

<script>
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from "vue-native-router";
import {AsyncStorage} from 'react-native';
import { Root } from "native-base";

import LoginScreen from "./screens/Login.vue";
import HomeScreen from "./screens/Home.vue";
import EmergencyDetails from "./screens/EmergencyDetails.vue";
import InitialReport from "./screens/InitialReport.vue";

const AppStack = createStackNavigator({
  Home: HomeScreen,
  EmergencyDetails: EmergencyDetails,
  InitialReport: InitialReport
},
{
  initialRouteName: 'Home',
  headerMode: "none"
});
const AuthStack = createStackNavigator({ Login: LoginScreen }, {headerMode: "none"});

const AppNavigation = createAppContainer(
  createSwitchNavigator(
    {
      Auth: AuthStack,
      App: AppStack
    },
    {
      initialRouteName: 'Auth',
      headerMode: "none"
    }
  )
);

export default {
  components: { Root, AppNavigation }
};
</script>
