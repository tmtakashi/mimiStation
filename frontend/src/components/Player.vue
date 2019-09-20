<template>
  <div>
    <v-container>
      <div class="my-9">
        <v-btn @click="togglePlay" id="play-btn">
          <v-icon id="play-icon">mdi-play</v-icon>
        </v-btn>
        <v-btn @click="backToBeginning" id="beginning-btn">
          <v-icon id="play-icon">mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn @click="setPointA" id="segment-A-btn">A</v-btn>
        <v-btn @click="setPointB" id="segment-B-btn">B</v-btn>
      </div>
      <div id="overview-container"></div>
      <div class="mt-9">
        <v-btn @click="zoomIn" id="zoom-in-btn">
          <v-icon id="zoom-in-icon">mdi-magnify-plus</v-icon>
        </v-btn>
        <v-btn @click="zoomOut" id="zoom-out-btn">
          <v-icon id="zoom-out-icon">mdi-magnify-minus</v-icon>
        </v-btn>
      </div>
      <div id="zoomview-container"></div>

      <audio @timeupdate="currentTime = $event.target.currentTime" ref="audio">
        <source
          src="https://wavesurfer-js.org/example/split-channels/stereo.mp3"
          type="audio/mpeg"
          codecs="mp3"
        />
      </audio>
    </v-container>
  </div>
</template>

<script>
import peaks from "peaks.js";

export default {
  data: function() {
    return {
      p: null,
      audio: null,
      currentTime: 0,
      markedPointA: false,
      markedPointB: false
    };
  },
  watch: {
    currentTime(currentTime) {
      if (Math.abs(currentTime - this.$store.getters.pointBTime) < 0.2) {
        this.p.player.seek(this.$store.getters.pointATime);
      }
    }
  },
  methods: {
    togglePlay: function() {
      let icon = document.getElementById("play-icon");
      if (this.audio.paused) {
        this.audio.play();
        icon.classList.remove("mdi-play");
        icon.classList.add("mdi-pause");
      } else {
        this.audio.pause();
        icon.classList.remove("mdi-pause");
        icon.classList.add("mdi-play");
      }
    },
    zoomIn: function() {
      this.p.zoom.zoomIn();
    },
    zoomOut: function() {
      this.p.zoom.zoomOut();
    },
    backToBeginning: function() {
      this.p.player.seek(0);
    },
    setPointA: function() {
      if (this.markedPointA == this.markedPointB) {
        this.$store.commit("setPointATime", this.currentTime);
        this.p.points.add({
          time: this.currentTime,
          editable: true,
          labelText: "A"
        });
        this.markedPointA = true;
      } else if (!this.markedPointB) {
        this.p.points.removeByTime(this.pointATime);
        this.markedPointA = false;
      }
    },
    setPointB: function() {
      if (
        (this.markedPointA && !this.markedPointB) ||
        this.currentTime > this.$store.getters.pointATime
      ) {
        this.$store.commit("setPointBTime", this.currentTime);
        this.p.points.add({
          time: this.currentTime,
          editable: true,
          labelText: "B"
        });
        this.markedPointB = true;
      } else if (this.markedPointA && this.pointBTime) {
        this.p.points.removeByTime(this.pointBTime);
        this.markedPointB = false;
      }
      this.p.player.seek(this.$store.getters.pointATime);
    }
  },
  mounted() {
    this.audio = this.$refs.audio;
    this.p = peaks.init({
      containers: {
        zoomview: document.getElementById("zoomview-container"),
        overview: document.getElementById("overview-container")
      },
      mediaElement: this.audio,
      webAudio: {
        audioContext: new AudioContext(),
        audioBuffer: null,
        multiChannel: false
      },
      zoomWaveformColor: "#6A5C55",
      zoomLevels: [128, 256, 512, 1024, 2048],
      keyboard: true
    });
    this.p.zoom.setZoom(2);
  }
};
</script>