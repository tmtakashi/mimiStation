<template>
  <div>
    <v-app-bar color="primary" clipped-left app dark>
      <v-toolbar-title>mimiCopy</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <template v-if="$vuetify.breakpoint.smAndUp">
        <v-toolbar-items v-if="isSignedIn && $route.name == 'player'">
          <v-btn @click.stop="$store.commit('toggleDrawer')" text>
            AB Loops
            <v-icon>mdi-repeat</v-icon>
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-items v-if="isSignedIn && $route.name == 'player'">
          <v-btn @click.stop="toggleSongList(true)" text>Songs</v-btn>
          <SongList :visible="showSongList" @close="toggleSongList(false)"></SongList>
        </v-toolbar-items>
        <v-toolbar-items>
          <v-btn v-if="!isSignedIn" to="/signup" text>Sign Up</v-btn>
        </v-toolbar-items>
        <v-toolbar-items>
          <v-btn v-if="isSignedIn" @click="logout" text>Logout</v-btn>
        </v-toolbar-items>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import Firebase from "./../firebase";
import SongList from "./SongList.vue";

export default {
  components: {
    SongList
  },
  computed: {
    ...mapGetters(["showSongList", "isSignedIn"]),
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    logout: function() {
      Firebase.logout();
      this.$store.commit("toggleSongSelected", false);
    },
    toggleSongList: function(bool) {
      this.$store.commit("toggleSongList", bool);
    }
  }
};
</script>

<style>
</style>