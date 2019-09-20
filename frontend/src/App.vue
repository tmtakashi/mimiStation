<template>
  <v-app>
    <Navbar></Navbar>
    <Sidebar></Sidebar>
    <v-content>
      <Player></Player>
    </v-content>
  </v-app>
</template>

<script>
import store from "@/store/store.js";
import Player from "./components/Player.vue";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";

export default {
  store,
  name: "App",
  components: {
    Navbar,
    Sidebar,
    Player
  }
};
</script>

<style>
</style>
