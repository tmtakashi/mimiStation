<template>
  <v-navigation-drawer app clipped>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">AB Loops</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-layout row>
        <v-flex>
          <v-text-field
            @keydown.enter="addABLoop"
            v-model="ABLoopName"
            label="Name"
            style="float: left; width: 80%;"
            clearable
            solo
          ></v-text-field>
          <v-btn color="success" style="float: right;" @click="addABLoop" large icon>
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-subheader>Your AB Loops</v-subheader>
      <v-list-item v-for="(loop, index) in ABLoops" :key="index" two-line link>
        <v-list-item-content>
          <v-list-item-title>{{ loop.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ toMMSS(loop.pointATime) }} - {{ toMMSS(loop.pointBTime) }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="$store.commit('deleteABLoop', index)" icon>
            <v-icon>mdi-delete-circle</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: function() {
    return {
      ABLoopName: ""
    };
  },
  computed: {
    ...mapGetters(["ABLoops"])
  },
  methods: {
    toMMSS: function(secs) {
      var sec_num = parseInt(secs, 10);
      var minutes = Math.floor(sec_num / 60) % 60;
      var seconds = sec_num % 60;

      return [minutes, seconds].map(v => (v < 10 ? "0" + v : v)).join(":");
    },
    addABLoop: function() {
      this.$store.commit("addABLoop", this.ABLoopName);
      this.ABLoopName = "";
    }
  }
};
</script>

<style>
</style>