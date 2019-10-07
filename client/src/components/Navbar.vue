<template>
  <div>
    <v-app-bar color="primary" clipped-left app dark>
      <v-toolbar-title>mimiCopy</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <template v-if="$vuetify.breakpoint.smAndUp">
        <v-toolbar-items>
          <v-btn @click.stop="$store.commit('toggleDrawer')" text>
            AB Loops
            <v-icon>mdi-repeat</v-icon>
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-items>
          <v-btn @click.stop="showSongList=true" text>Songs</v-btn>
          <SongList :visible="showSongList" @close="showSongList=false"></SongList>
        </v-toolbar-items>
        <v-toolbar-items>
          <v-btn v-if="!userStatus" to="/signup" text>Sign Up</v-btn>
        </v-toolbar-items>
        <v-toolbar-items>
          <v-btn v-if="userStatus" @click="logout" text>Logout</v-btn>
        </v-toolbar-items>
        <v-toolbar-items>
          <v-btn @click="apiPrivate" text>private</v-btn>
        </v-toolbar-items>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import axios from "axios";
import Firebase from "./../firebase";
import SongList from "./SongList.vue";

export default {
  components: {
    SongList
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userStatus() {
      // ログインするとtrue
      return this.$store.getters.isSignedIn;
    }
  },
  data: function() {
    return {
      showSongList: false
    };
  },
  methods: {
    logout: function() {
      Firebase.logout();
    },
    apiPrivate: async function() {
      let res = await axios.get("http://localhost:8000/private", {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
      });
    }
  }
};
</script>

<style>
</style>