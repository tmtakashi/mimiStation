<template>
  <v-navigation-drawer app clipped>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">AB Sections</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item align="center">
      <v-btn
        color="success"
        @click="$store.commit('addABLoop', name)"
        class="mb-5"
        small
      >Add Current AB Loop</v-btn>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item v-for="(loop, index) in ABLoops" :key="index" two-line>
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
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: function() {
    return {
      ABLoopName: String
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
    }
  }
};
</script>

<style>
</style>