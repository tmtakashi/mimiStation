<template>
  <div>
    <GlobalEvents
      v-if="!editMode"
      @keydown.space="togglePlay"
      @keydown.enter="backToBeginning"
      @keydown.ctrl.65="setPointA"
      @keydown.ctrl.66="setPointB"
      @keydown.ctrl.187="zoomIn"
      @keydown.ctrl.189="zoomOut"
    />
    <v-container>
      <h3 v-if="songSelected && !isLoading" class>{{ currentSong.artist }} - {{ currentSong.name }}</h3>
      <v-row v-show="songSelected">
        <v-col cols="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn @click="togglePlay" v-on="on" id="play-btn">
                <v-icon id="play-icon">mdi-play</v-icon>
              </v-btn>
            </template>
            <span>Space</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn @click="backToBeginning" v-on="on" id="beginning-btn">
                <v-icon id="play-icon">mdi-skip-previous</v-icon>
              </v-btn>
            </template>
            <span>Enter</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn @click="setPointA" v-on="on" id="segment-A-btn">A</v-btn>
            </template>
            <span>Ctrl + A</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn @click="setPointB" v-on="on" id="segment-B-btn">B</v-btn>
            </template>
            <span>Ctrl + B</span>
          </v-tooltip>
        </v-col>
        <v-col cols="3">
          <v-row>
            <v-col class="py-0" cols="8">
              <label for>Speed</label>
              <v-slider
                v-model="speed"
                prepend-icon="mdi-tortoise"
                append-icon="mdi-rabbit"
                min="0.1"
                max="1.5"
                step="0.01"
              ></v-slider>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="speed"
                class="mt-0 pt-0"
                min="0.1"
                max="1.5"
                step="0.01"
                hide-details
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3">
          <v-row>
            <v-col class="py-0" cols="10">
              <label for>Volume</label>
              <v-slider
                v-model="volume"
                prepend-icon="mdi-volume-low"
                append-icon="mdi-volume-high"
                min="0"
                max="1"
                step="0.01"
              ></v-slider>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="volume"
                class="mt-0 pt-0"
                min="0"
                max="1"
                step="0.01"
                hide-detail
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2">
          <v-menu
            :close-on-content-click="false"
            :close-on-click="false"
            :nudge-width="250"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on">LR Control</v-btn>
            </template>

            <v-card class="py-3 px-3">
              <v-row>
                <v-col cols="9">
                  <v-row>
                    <v-col class="py-0" cols="9">
                      <label for>Left Volume</label>
                      <v-slider
                        v-model="leftVolume"
                        prepend-icon="mdi-volume-low"
                        append-icon="mdi-volume-high"
                        min="0"
                        max="1"
                        step="0.01"
                      ></v-slider>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="leftVolume"
                        class="mt-0 pt-0"
                        min="0"
                        max="1"
                        step="0.01"
                        hide-detail
                        type="number"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="py-0" cols="9">
                      <label for>Right Volume</label>
                      <v-slider
                        v-model="rightVolume"
                        prepend-icon="mdi-volume-low"
                        append-icon="mdi-volume-high"
                        min="0"
                        max="1"
                        step="0.01"
                      ></v-slider>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="rightVolume"
                        class="mt-0 pt-0"
                        min="0"
                        max="1"
                        step="0.01"
                        hide-detail
                        type="number"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col align-center cols="3">
                  <v-flex fill-height>
                    <label for>Pan</label>
                    <knob-control :min="0" :max="127" :stepSize="1" :size="70" v-model="pan"></knob-control>
                  </v-flex>
                </v-col>
              </v-row>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>

      <div id="overview-container"></div>
      <div class="mt-9" v-show="songSelected">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn @click="zoomIn" v-on="on" id="zoom-in-btn">
              <v-icon id="zoom-in-icon">mdi-magnify-plus</v-icon>
            </v-btn>
          </template>
          <span>Ctrl + '+'</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn @click="zoomOut" v-on="on" id="zoom-out-btn">
              <v-icon id="zoom-out-icon">mdi-magnify-minus</v-icon>
            </v-btn>
          </template>
          <span>Ctrl + '-'</span>
        </v-tooltip>
      </div>
      <div id="zoomview-container"></div>

      <audio @timeupdate="currentTime = $event.target.currentTime" ref="audio">
        <source />
      </audio>
    </v-container>
  </div>
</template>

<script>
import GlobalEvents from "vue-global-events";
import { mapGetters } from "vuex";
import KnobControl from "vue-knob-control";

export default {
  components: {
    GlobalEvents,
    KnobControl
  },
  data: function() {
    return {
      currentTime: 0,
      speed: 1,
      volume: 1,
      leftVolume: 1,
      rightVolume: 1,
      pan: 64
    };
  },
  computed: {
    ...mapGetters([
      "audioElement",
      "audioContext",
      "currentSong",
      "p",
      "ABLoops",
      "pointATime",
      "pointBTime",
      "markedPointA",
      "markedPointB",
      "editMode",
      "songSelected",
      "isLoading"
    ])
  },
  watch: {
    currentTime(currentTime) {
      let validABTime = this.pointATime != this.pointBTime;
      if (Math.abs(currentTime - this.pointBTime) < 0.2 && validABTime) {
        this.p.player.seek(this.pointATime);
      }
    },
    speed(val) {
      this.$store.dispatch("changePlaybackRate", val);
    },
    volume(val) {
      this.$store.commit("setGainValue", { val: val, type: "center" });
    },
    leftVolume(val) {
      this.$store.commit("setGainValue", { val: val, type: "left" });
    },
    rightVolume(val) {
      this.$store.commit("setGainValue", { val: val, type: "right" });
    },
    pan(val) {
      if (val == 0) {
        val = 1;
      }
      var pan = ((val - 1) / (127 - 1)) * (1 - -1) + -1;
      this.$store.commit("setPanValue", pan);
    }
  },
  methods: {
    togglePlay: function(e) {
      e.preventDefault();
      let icon = document.getElementById("play-icon");
      if (this.audioElement.paused) {
        this.audioElement.play();
        icon.classList.remove("mdi-play");
        icon.classList.add("mdi-pause");
      } else {
        this.audioElement.pause();
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
    backToBeginning: function(e) {
      e.preventDefault();
      this.p.player.seek(0);
    },
    setPointA: function() {
      if (this.markedPointA == false && this.markedPointB == false) {
        this.$store.commit("setPointATime", this.currentTime);
        this.p.points.add({
          time: this.currentTime,
          editable: true,
          labelText: "A"
        });
        this.$store.commit("toggleMarkedPointA");
      } else if (!this.markedPointB) {
        this.p.points.removeByTime(this.pointATime);
        this.$store.commit("setPointATime", 0);
        this.$store.commit("toggleMarkedPointA");
      }
    },
    setPointB: function() {
      if (
        this.markedPointA &&
        !this.markedPointB &&
        this.currentTime > this.$store.getters.pointATime
      ) {
        this.$store.commit("setPointBTime", this.currentTime);
        this.p.points.add({
          time: this.currentTime,
          editable: true,
          labelText: "B"
        });
        this.$store.commit("toggleMarkedPointB");
      } else if (this.markedPointA && this.markedPointB) {
        this.p.points.removeByTime(this.pointBTime);
        this.$store.commit("setPointBTime", 0);
        this.$store.commit("toggleMarkedPointB");
      }
      this.p.player.seek(this.$store.getters.pointATime);
    }
  },
  mounted() {
    this.$store.commit("setAudioElement", this.$refs.audio);
    let options = {
      containers: {
        zoomview: document.getElementById("zoomview-container"),
        overview: document.getElementById("overview-container")
      },
      mediaElement: this.audioElement,
      webAudio: {
        audioContext: this.audioContext,
        audioBuffer: null,
        multiChannel: false
      },
      zoomWaveformColor: "#6A5C55",
      zoomLevels: [128, 256, 512, 1024, 2048],
      keyboard: true
    };
    this.$store.dispatch("initializeP", options);
  }
};
</script>