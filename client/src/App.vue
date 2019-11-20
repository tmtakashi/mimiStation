<template>
  <v-app>
    <Navbar v-on:changeSongList="changeSongList"></Navbar>
    <Sidebar :songList="songList"></Sidebar>
    <v-content>
      <router-view />
    </v-content>
    <Loading :active.sync="isLoading" :is-full-page="true"></Loading>
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
  },
  data: function() {
    return { songList: [] };
  },
  methods: {
    changeSongList: function(songList) {
      this.songList = songList;
    }
  }
};
</script>

<style>
</style>
