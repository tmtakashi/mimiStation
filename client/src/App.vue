<template>
  <v-app>
    <Navbar></Navbar>
    <Sidebar></Sidebar>
    <v-content>
      <router-view />
    </v-content>
    <loading :active.sync="isLoading" :is-full-page="true"></loading>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store/store.js";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  store,
  name: "App",
  components: {
    Navbar,
    Sidebar,
    Loading
  },
  computed: {
    ...mapGetters(["isLoading"])
  }
};
</script>

<style>
</style>
