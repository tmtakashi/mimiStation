<template>
  <v-navigation-drawer :value="drawer" app clipped left>
    <v-list-item v-if="ABLoops.length === 0">
      <v-list-item-content>
        <v-list-item-title>You have no AB Loops!</v-list-item-title>
        <v-list-item-subtitle>Add a loop with the AB buttons.</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item class="mt-6" v-if="bothABMarked">
      <v-layout row>
        <v-flex>
          <v-text-field
            @keydown.enter="addABLoop($event)"
            @focus="$store.commit('changeEditMode', true)"
            v-model="ABLoopName"
            label="Name"
            style="float: left; width: 80%;"
            clearable
            solo
          ></v-text-field>
          <v-btn color="success" style="float: right;" @click="addABLoop($event)" large icon>
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-list-item>

    <v-divider></v-divider>

    <v-list v-if="ABLoops">
      <draggable v-model="ABLoops" class="v-list__container" handle=".handle">
        <v-list-item v-for="(loop, index) in ABLoops" :key="index" two-line link>
          <v-icon class="mr-5 handle">mdi-reorder-horizontal</v-icon>
          <v-list-item-content @click="playLoop(loop)">
            <v-list-item-title>{{ loop.labelText }}</v-list-item-title>
            <v-list-item-subtitle>{{ toMMSS(loop.startTime) }} - {{ toMMSS(loop.endTime) }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn @click="deleteABLoop({loop: loop, songList: songList})" icon>
              <v-icon color="red">mdi-delete-circle</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </draggable>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import draggable from "vuedraggable";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    draggable
  },
  props: ["songList"],
  data: function() {
    return {
      ABLoopName: "",
      bothABMarked: false
    };
  },
  computed: {
    ...mapGetters(["ABLoops", "markedPointA", "markedPointB", "drawer"])
  },
  watch: {
    markedPointB(val) {
      if (val == true && this.markedPointA == true) {
        this.bothABMarked = true;
      }
    },
    bothABMarked(newVal, oldVal) {
      if (newVal != oldVal) {
        this.$store.commit("changeEditMode", newVal);
      } else return;
    }
  },
  methods: {
    toMMSS: function(secs) {
      var sec_num = parseInt(secs, 10);
      var minutes = Math.floor(sec_num / 60) % 60;
      var seconds = sec_num % 60;

      return [minutes, seconds].map(v => (v < 10 ? "0" + v : v)).join(":");
    },
    addABLoop: function(event) {
      event.stopPropagation();
      this.$store
        .dispatch("addABLoop", {
          labelText: this.ABLoopName,
          songList: this.songList
        })
        .then(() => {
          this.ABLoopName = "";
          this.$store.commit("toggleMarkedPointA");
          this.$store.commit("toggleMarkedPointB");
          this.bothABMarked = false;
        });
    },
    ...mapActions(["playLoop", "deleteABLoop"])
  }
};
</script>

<style>
.handle {
  cursor: move;
}
</style>