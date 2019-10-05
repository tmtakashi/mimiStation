<template>
  <v-app>
    <Navbar></Navbar>
    <Sidebar></Sidebar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import store from "@/store/store.js";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";

export default {
  store,
  name: "App",
  components: {
    Navbar,
    Sidebar
  }
};
</script>

<style>
</style>
