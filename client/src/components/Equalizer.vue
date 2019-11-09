<template>
  <v-card class="py-3 px-5">
    <v-row class>
      <v-col v-for="(fc, index) in centerFreqs" :key="index">
        <v-row align-center>
          <label>{{ fc }}</label>
        </v-row>
        <v-row>
          <v-slider :min="-12" :max="12" v-model="dBs[index]" vertical></v-slider>
        </v-row>
        <v-row>{{ dBs[index] }} dB</v-row>
      </v-col>
    </v-row>
    <v-btn @click="reset">reset</v-btn>
  </v-card>
</template>

<script>
import { unit } from "mathjs";

export default {
  data: function() {
    return {
      centerFreqs: Array.apply(null, new Array(10)).map(function(v, i) {
        return unit(31.25 * Math.pow(2, i), "Hz");
      }),
      dBs: new Array(10).fill(0)
    };
  },
  computed: {
    //   for watching dBs
    computeddBs: function() {
      return Array.from(this.dBs);
    }
  },
  watch: {
    computeddBs: {
      deep: true,
      handler: function(values, oldValues) {
        const index = values.findIndex(function(v, i) {
          return v !== oldValues[i];
        });
        var gain = values[index];
        this.$store.commit("setPeakingGain", { index: index, gain: gain });
      }
    }
  },
  methods: {
    reset: function() {
      this.dBs = new Array(10).fill(0);
      this.$store.commit("resetPeakingGain");
    }
  }
};
</script>

<style>
</style>