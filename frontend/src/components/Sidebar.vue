<template>
  <v-navigation-drawer app clipped>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">AB Sections</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-btn class="mb-9">Add Current AB Loop</v-btn>
    <v-divider></v-divider>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["addABLoop"])
  },
  computed: {
    ...mapGetters(["ABLoops"])
  }
};
</script>

<style>
</style>